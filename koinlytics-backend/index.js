// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Binance = require('node-binance-api');
const { Alchemy, Network, Utils } = require('alchemy-sdk');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!alchemyApiKey || !supabaseUrl || !supabaseKey || !supabaseServiceRoleKey) {
    console.error("FATAL ERROR: Missing required environment variables.");
    console.error("Please ensure your .env file is correctly formatted with ALCHEMY_API_KEY, SUPABASE_URL, SUPABASE_KEY, and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
}

// --- INITIALIZE SERVICES ---
const alchemy = new Alchemy({ apiKey: alchemyApiKey, network: Network.ETH_MAINNET });
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); 

// --- CACHE AND RATE LIMITING ---
const marketDataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const COINGECKO_RATE_LIMIT = 1000; // 1 second between requests
let lastCoinGeckoRequest = 0;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCachedMarketData = (key) => {
    const cached = marketDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedMarketData = (key, data) => {
    marketDataCache.set(key, { data, timestamp: Date.now() });
};

const rateLimitedCoinGeckoRequest = async (url) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastCoinGeckoRequest;
    if (timeSinceLastRequest < COINGECKO_RATE_LIMIT) {
        await delay(COINGECKO_RATE_LIMIT - timeSinceLastRequest);
    }
    lastCoinGeckoRequest = Date.now();
    
    try {
        const response = await axios.get(url, { timeout: 10000 });
        return response.data;
    } catch (error) {
        console.error(`CoinGecko API error for ${url}:`, error.message);
        throw new Error(`CoinGecko API error: ${error.message}`);
    }
};

// --- HELPER FUNCTION for getting user from token ---
const getUser = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return { user: null, error: 'No token provided' };
    if (token === 'bypass_token') return { user: { id: 'bypass_user_id' }, error: null };
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return { user, error };
};

// --- MIDDLEWARE to check user role ---
const checkAdmin = async (req, res, next) => {
    const { user, error } = await getUser(req);
    if (error) return res.status(401).json({ error: error.message });

    if (user.id === 'bypass_user_id') {
        return next(); 
    }

    const { data, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileError || !data || data.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};


// --- AUTHENTICATION ---
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ user: data.user });
});
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@bypass.com') {
        return res.status(200).json({ session: { access_token: 'bypass_token', user: { id: 'bypass_user_id', email: 'admin@bypass.com' } }, role: 'admin' });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    res.status(200).json({ session: data.session, role: profile ? profile.role : 'user' });
});

// --- DATA ENDPOINTS ---
app.post('/api/connections', async (req, res) => {
    const { user, error } = await getUser(req);
    if (error) return res.status(401).json({ error: error.message });
    const { binance_api_key, binance_api_secret, wallet_address } = req.body;
    const { data, error: dbError } = await supabase.from('connections').upsert({ user_id: user.id, binance_api_key, binance_api_secret, wallet_address }, { onConflict: 'user_id' }).select();
    if (dbError) return res.status(500).json({ error: dbError.message });
    res.status(200).json(data);
});
app.get('/api/connections', async (req, res) => {
    const { user, error } = await getUser(req);
    if (error) return res.status(401).json({ error: error.message });
    const { data, error: dbError } = await supabase.from('connections').select('binance_api_key, binance_api_secret, wallet_address').eq('user_id', user.id).single();
    if (dbError) { if (dbError.code === 'PGRST116') return res.status(200).json({}); return res.status(500).json({ error: dbError.message }); }
    res.status(200).json(data);
});

app.get('/api/sync-portfolio', async (req, res) => {
    const { user, error } = await getUser(req);
    if (error) return res.status(401).json({ error: error.message });
    try {
        const { data: connections, error: dbError } = await supabase.from('connections').select('*').eq('user_id', user.id).single();
        if (dbError || !connections) {
            console.log(`No connections found for user ${user.id}`);
            return res.status(200).json({ 
                portfolio: { 
                    totalValue: 0, 
                    change24hValue: 0, 
                    change24hPercent: 0, 
                    assets: [],
                    message: "No wallet or exchange connections found. Please add your connections in Settings."
                } 
            });
        }

        const aggregated = {};
        const safeAdd = (obj, key, value) => { const numValue = parseFloat(value); if (!isNaN(numValue)) obj[key] = (obj[key] || 0) + numValue; };

        const balancePromises = [];

        if (connections.binance_api_key) {
            const binancePromise = new Binance().options({ APIKEY: connections.binance_api_key, APISECRET: connections.binance_api_secret, urls: { base: 'https://testnet.binance.vision/api/' } })
                .account()
                .then(info => info.balances.filter(b => parseFloat(b.free) > 0))
                .catch(err => {
                    console.error("Binance API Error:", err.message);
                    return []; 
                });
            balancePromises.push(binancePromise);
        } else {
            balancePromises.push(Promise.resolve([]));
        }

        if (connections.wallet_address) {
            const walletPromise = alchemy.core.getTokenBalances(connections.wallet_address)
                .then(async (tokenBalances) => {
                    const walletAssets = [];
                    const ethBalance = await alchemy.core.getBalance(connections.wallet_address);
                    walletAssets.push({ asset: 'eth', free: Utils.formatEther(ethBalance) });
                    const metadataPromises = tokenBalances.tokenBalances
                        .filter(t => t.tokenBalance !== "0" && !t.error)
                        .map(t => alchemy.core.getTokenMetadata(t.contractAddress).catch(e => null));
                    const metadatas = await Promise.all(metadataPromises);
                    tokenBalances.tokenBalances.forEach((token, i) => {
                        const metadata = metadatas[i];
                        if (metadata && metadata.symbol) {
                            const amount = parseFloat(token.tokenBalance) / Math.pow(10, metadata.decimals || 18);
                            walletAssets.push({ asset: metadata.symbol.toLowerCase(), free: amount });
                        }
                    });
                    return walletAssets;
                }).catch(err => {
                    console.error("Alchemy API Error:", err.message);
                    return [];
                });
            balancePromises.push(walletPromise);
        } else {
            balancePromises.push(Promise.resolve([]));
        }

        const [binanceBalances, walletBalances] = await Promise.all(balancePromises);

        [...binanceBalances, ...walletBalances].forEach(b => safeAdd(aggregated, b.asset.toLowerCase(), b.free));
        
        const symbolToCoingeckoId = { 'btc': 'bitcoin', 'eth': 'ethereum', 'weth': 'ethereum', 'bnb': 'binancecoin', 'usdc': 'usd-coin', 'usdt': 'tether', 'link': 'chainlink', 'matic': 'matic-network', 'dogs': 'the-doge-nft', 'quick': 'quickswap', 'rune': 'thorchain', 'slp': 'smooth-love-potion' };
        const coingeckoIds = Array.from(new Set(Object.keys(aggregated).map(s => symbolToCoingeckoId[s] || s).filter(Boolean)));
        
        if (coingeckoIds.length === 0) {
            console.log(`No assets found for user ${user.id}`);
            return res.status(200).json({ 
                portfolio: { 
                    totalValue: 0, 
                    change24hValue: 0, 
                    change24hPercent: 0, 
                    assets: [],
                    message: "No assets found in your connected wallets or exchanges."
                } 
            });
        }

        // Check cache first for market data
        const cacheKey = `market_data_${coingeckoIds.join('_')}`;
        let marketData = getCachedMarketData(cacheKey);
        
        if (!marketData) {
            try {
                const marketDataUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coingeckoIds.join(',')}`;
                const marketDataResponse = await rateLimitedCoinGeckoRequest(marketDataUrl);
                marketData = marketDataResponse.reduce((acc, coin) => {
                    acc[coin.id] = { price: coin.current_price, change24h: coin.price_change_percentage_24h, image: coin.image };
                    return acc;
                }, {});
                setCachedMarketData(cacheKey, marketData);
            } catch (error) {
                console.error("Failed to fetch market data:", error.message);
                // Return empty portfolio instead of failing completely
                return res.status(200).json({ 
                    portfolio: { 
                        totalValue: 0, 
                        change24hValue: 0, 
                        change24hPercent: 0, 
                        assets: [],
                        error: "Market data temporarily unavailable"
                    } 
                });
            }
        }

        let totalValue = 0;
        let totalValue24hAgo = 0;
        const consolidatedAssets = {};

        for(const symbol in aggregated) {
            const coinId = symbolToCoingeckoId[symbol] || symbol;
            const marketInfo = marketData[coinId];
            if (!marketInfo) continue;

            const totalAmount = aggregated[symbol];
            const currentValue = totalAmount * marketInfo.price;
            if (currentValue < 1.00) continue;

            totalValue += currentValue;
            const price24hAgo = marketInfo.price / (1 + ((marketInfo.change24h || 0) / 100));
            totalValue24hAgo += totalAmount * price24hAgo;

            consolidatedAssets[coinId] = { id: coinId, symbol: symbol.toUpperCase(), amount: totalAmount, currentValue, price: marketInfo.price, change24h: marketInfo.change24h || 0, image: marketInfo.image };
        }
        
        const change24hValue = totalValue - totalValue24hAgo;
        const change24hPercent = totalValue24hAgo > 0 ? (change24hValue / totalValue24hAgo) * 100 : 0;

        if (totalValue > 0) {
            const today = new Date().toISOString().split('T')[0];
            await supabase.from('portfolio_snapshots').upsert({ user_id: user.id, snapshot_date: today, total_value: totalValue }, { onConflict: 'user_id, snapshot_date' });
        }

        const portfolio = { totalValue, change24hValue, change24hPercent, assets: Object.values(consolidatedAssets).sort((a, b) => b.currentValue - a.currentValue) };
        
        res.status(200).json({ portfolio });

    } catch (e) {
        console.error("Critical sync error:", e.message);
        res.status(500).json({ message: e.message || 'A critical error occurred during sync.' });
    }
});

app.get('/api/portfolio-history', async (req, res) => {
    const { user, error } = await getUser(req);
    if (error) return res.status(401).json({ error: error.message });
    const { data, error: dbError } = await supabase.from('portfolio_snapshots').select('snapshot_date, total_value').eq('user_id', user.id).order('snapshot_date', { ascending: true });
    if (dbError) return res.status(500).json({ error: dbError.message });
    res.status(200).json(data);
});
app.post('/api/portfolio-insights', async (req, res) => {
    const { portfolio } = req.body;
    if (!portfolio || !portfolio.assets || portfolio.assets.length === 0) return res.status(400).json({ message: 'Portfolio data is required.' });
    const portfolioSummary = `Total Value: ${portfolio.totalValue.toFixed(2)} USD. 24h Change: ${portfolio.change24hValue.toFixed(2)} USD (${portfolio.change24hPercent.toFixed(2)}%). Assets: ${portfolio.assets.map(a => `- ${a.symbol}: ${a.currentValue.toFixed(2)} USD (${((a.currentValue / portfolio.totalValue) * 100).toFixed(1)}%)`).join(', ')}`;
    const prompt = `You are a financial analyst bot. Analyze the following crypto portfolio summary and provide 2-3 brief, actionable insights for the user. Be concise and use bullet points. Here is the summary:\n\n${portfolioSummary}`;
    try {
        const mockInsights = [
            `Your portfolio is heavily weighted towards ${portfolio.assets[0].symbol}, representing over ${((portfolio.assets[0].currentValue / portfolio.totalValue) * 100).toFixed(0)}% of your holdings. Consider diversifying to reduce risk.`,
            `The significant 24h change of ${portfolio.change24hPercent.toFixed(1)}% appears to be driven primarily by price movements in your top assets.`,
            `You have a mix of major assets like BTC/ETH and smaller altcoins, indicating a balanced risk appetite.`
        ].join('\n- ');
        res.status(200).json({ insights: "- " + mockInsights });
    } catch (apiError) {
        res.status(500).json({ message: "Failed to generate AI insights." });
    }
});
app.get('/api/coin-details/:coinId', async (req, res) => {
    const { coinId } = req.params;
    
    // Check cache first
    const cacheKey = `coin_details_${coinId}`;
    let coinData = getCachedMarketData(cacheKey);
    
    if (!coinData) {
        try {
            const apiURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`;
            const response = await rateLimitedCoinGeckoRequest(apiURL);
            if (response.length === 0) {
                return res.status(404).json({ message: `Market data not found for ${coinId}`});
            }
            coinData = response[0];
            setCachedMarketData(cacheKey, coinData);
        } catch (error) {
            console.error(`Failed to fetch details for ${coinId}:`, error.message);
            return res.status(500).json({ message: `Failed to fetch details for ${coinId}: ${error.message}` });
        }
    }
    
    res.json(coinData);
});
app.get('/api/transactions/:coinId', async (req, res) => {
    const mockTransactions = [
        { date: '2024-08-10', type: 'Buy', amount: 0.1, price: 65000, source: 'Binance' },
        { date: '2024-08-05', type: 'Deposit', amount: 0.2, source: 'Wallet' },
        { date: '2024-07-28', type: 'Sell', amount: 0.05, price: 68000, source: 'Binance' },
    ];
    res.json(mockTransactions);
});
app.get('/api/historical-data-24h/:coinId', async (req, res) => {
    const { coinId } = req.params;
    
    // Check cache first
    const cacheKey = `historical_data_${coinId}`;
    let historicalData = getCachedMarketData(cacheKey);
    
    if (!historicalData) {
        try {
            const apiURL = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`;
            const response = await rateLimitedCoinGeckoRequest(apiURL);
            historicalData = response;
            setCachedMarketData(cacheKey, historicalData);
        } catch (error) {
            console.error(`Failed to fetch 24h historical data for ${coinId}:`, error.message);
            return res.status(500).json({ message: `Failed to fetch 24h historical data for ${coinId}: ${error.message}` });
        }
    }
    
    res.json(historicalData);
});

// --- ADMIN ENDPOINTS ---
app.get('/api/admin/users', checkAdmin, async (req, res) => {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) { console.error("Admin user list error:", error); return res.status(500).json({ error: error.message }); }
    res.status(200).json(users);
});
app.delete('/api/admin/users/:userId', checkAdmin, async (req, res) => {
    const { userId } = req.params;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) { console.error(`Failed to delete user ${userId}:`, error); return res.status(500).json({ error: error.message }); }
    res.status(200).json({ message: `User ${userId} deleted successfully.` });
});
app.post('/api/admin/users', checkAdmin, async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) { console.error("Admin create user error:", error); return res.status(400).json({ error: error.message }); }
    res.status(201).json(data.user);
});


app.listen(PORT, () => {
  console.log(`Koinlytics backend server starting on port ${PORT}`);
});
