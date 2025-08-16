# 🚀 Koinlytics - Advanced Crypto Portfolio Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-blue.svg)](https://www.chartjs.org/)

> **Professional-grade cryptocurrency portfolio tracking with real-time analytics, multi-exchange integration, and AI-powered insights.**

## 📋 Table of Contents

- [✨ Features Overview](#-features-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Complete Setup Guide](#-complete-setup-guide)
- [🔧 Configuration](#-configuration)
- [📱 User Interface](#-user-interface)
- [🔒 Security Features](#-security-features)
- [📊 Performance Optimizations](#-performance-optimizations)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📈 Roadmap](#-roadmap)
- [🐛 Troubleshooting](#-troubleshooting)
- [📚 API Documentation](#-api-documentation)
- [📄 License](#-license)

## ✨ Features Overview

### 🎯 **Core Portfolio Management**
- **Multi-Exchange Integration**: Connect Binance, Ethereum wallets, and more
- **Real-Time Portfolio Tracking**: Live updates with 24/7 market data
- **Asset Aggregation**: Unified view across all your crypto holdings
- **Portfolio Valuation**: Accurate USD value calculations with market rates

### 📊 **Advanced Analytics & Charts**
- **Multi-Time Period Views**: 24H, 7D, 30D, and 1Y performance charts
- **Interactive Portfolio Performance**: Smooth, responsive Chart.js visualizations
- **Portfolio Distribution**: Doughnut charts showing asset allocation
- **Asset-Specific Charts**: Individual coin price history and trends
- **Real-Time Data**: Live market data from CoinGecko API

### 🧠 **AI-Powered Portfolio Insights**
- **Portfolio Health Analysis**: Comprehensive health scoring
- **Risk Assessment**: AI-driven risk factor identification
- **Optimization Recommendations**: Personalized portfolio suggestions
- **Performance Analytics**: Deep-dive into portfolio metrics

### 🔐 **Enterprise-Grade Security**
- **Supabase Authentication**: Secure user management system
- **Role-Based Access Control**: Admin and user permission levels
- **API Key Management**: Secure exchange API integration
- **Data Encryption**: End-to-end data protection

### 🎨 **Modern User Experience**
- **Responsive Design**: Works perfectly on all devices
- **Dark Theme**: Professional dark mode interface
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Keyboard Shortcuts**: Power user navigation features
- **Real-Time Updates**: Live data without page refreshes

## 🏗️ Architecture

### **Frontend Technologies**
- **HTML5 + CSS3**: Modern, semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Professional charting library
- **Vanilla JavaScript**: No framework dependencies
- **Responsive Design**: Mobile-first approach

### **Backend Technologies**
- **Node.js**: High-performance JavaScript runtime
- **Express.js**: Fast, unopinionated web framework
- **Supabase**: Open-source Firebase alternative
- **PostgreSQL**: Robust relational database
- **RESTful API**: Clean, REST-compliant endpoints

### **External Integrations**
- **CoinGecko API**: Comprehensive cryptocurrency data
- **Binance API**: Exchange integration
- **Alchemy SDK**: Ethereum blockchain data
- **Rate Limiting**: API protection and optimization

## 🚀 Complete Setup Guide

### **Prerequisites**

Before starting, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

### **Step 1: Project Setup**

#### **1.1 Clone the Repository**
```bash
# Clone the project
git clone https://github.com/yourusername/koinlytics.git

# Navigate to project directory
cd koinlytics

# Check the structure
ls -la
```

#### **1.2 Verify Project Structure**
Your project should look like this:
```
koinlytics/
├── frontend/
│   ├── index.html          # Login/Signup page
│   ├── dashboard.html      # Main dashboard
│   ├── admin.html          # Admin panel
│   ├── settings.html       # User settings
│   ├── asset.html          # Asset details
│   └── review.html         # Portfolio review
├── koinlytics-backend/
│   ├── index.js            # Main server file
│   ├── package.json        # Dependencies
│   └── package-lock.json   # Lock file
└── README.md               # This file
```

### **Step 2: Backend Setup**

#### **2.1 Install Dependencies**
```bash
# Navigate to backend directory
cd koinlytics-backend

# Install Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

#### **2.2 Create Environment File**
```bash
# Create .env file
touch .env

# Open in your editor
code .env
```

#### **2.3 Configure Environment Variables**
Add the following to your `.env` file:

```env
# ========================================
# SUPABASE CONFIGURATION
# ========================================
# Get these from your Supabase project dashboard
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ========================================
# EXTERNAL API KEYS
# ========================================
# Get from https://www.alchemy.com/
ALCHEMY_API_KEY=your_alchemy_api_key_here

# ========================================
# SERVER CONFIGURATION
# ========================================
PORT=8080
NODE_ENV=development

# ========================================
# CORS SETTINGS (Optional)
# ========================================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000,http://127.0.0.1:5500
```

#### **2.4 Get Required API Keys**

**🔑 Supabase Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the following:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

**🔑 Alchemy Setup:**
1. Go to [alchemy.com](https://alchemy.com)
2. Create a new app
3. Copy the API key → `ALCHEMY_API_KEY`

**🔑 CoinGecko (Free):**
- No API key required for basic usage
- Rate limit: 50 calls/minute

### **Step 3: Database Setup**

#### **3.1 Access Supabase SQL Editor**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

#### **3.2 Create Database Tables**
Copy and paste this SQL code:

```sql
-- ========================================
-- PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONNECTIONS TABLE
-- ========================================
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  binance_api_key TEXT,
  binance_api_secret TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PORTFOLIO SNAPSHOTS TABLE
-- ========================================
CREATE TABLE portfolio_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  snapshot_date DATE,
  total_value DECIMAL(20,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE RLS POLICIES
-- ========================================
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Connections policies
CREATE POLICY "Users can view own connections" ON connections 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own connections" ON connections 
FOR ALL USING (auth.uid() = user_id);

-- Portfolio snapshots policies
CREATE POLICY "Users can view own snapshots" ON portfolio_snapshots 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots" ON portfolio_snapshots 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- CREATE ADMIN USER
-- ========================================
-- Insert admin profile (you'll need to create the user first via Supabase Auth)
INSERT INTO profiles (id, role) 
VALUES ('your-admin-user-id', 'admin') 
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

#### **3.3 Enable Authentication**
1. Go to Authentication → Settings in Supabase
2. Enable "Enable email confirmations" (optional)
3. Set your site URL (e.g., `http://localhost:3000`)

### **Step 4: Start the Backend**

#### **4.1 Start Development Server**
```bash
# Make sure you're in the backend directory
cd koinlytics-backend

# Start the server
npm start

# You should see:
# Server running on http://localhost:8080
# Connected to Supabase
```

#### **4.2 Test Backend Connection**
Open a new terminal and test:

```bash
# Test if server is running
curl http://localhost:8080

# Test Supabase connection
curl http://localhost:8080/api/health
```

### **Step 5: Frontend Setup**

#### **5.1 Serve Frontend Files**
You have several options:

**Option A: Using Python (Recommended for development)**
```bash
# Navigate to project root
cd ..

# Start Python server
python -m http.server 8000

# Open http://localhost:8000/frontend/
```

**Option B: Using Node.js**
```bash
# Install serve globally
npm install -g serve

# Navigate to frontend directory
cd frontend

# Start server
serve -p 8000

# Open http://localhost:8000
```

**Option C: Using VS Code Live Server Extension**
1. Install "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"

#### **5.2 Configure Frontend API URL**
Open `frontend/dashboard.html` and update the API URL:

```javascript
// Find this line (around line 176)
const API_URL = 'http://localhost:8080/api';

// Make sure it points to your backend
```

### **Step 6: First Login & Testing**

#### **6.1 Create Admin Account**
1. Open `http://localhost:8000/frontend/`
2. Click "Sign Up"
3. Use email: `admin@bypass.com`
4. Use any password
5. You'll be redirected to admin panel

#### **6.2 Test Admin Panel**
1. Verify you can see the admin dashboard
2. Check if user management works
3. Test keyboard shortcuts (Ctrl+Shift+D for Dashboard)

#### **6.3 Test Regular User Flow**
1. Sign up with a different email
2. Verify you're redirected to dashboard
3. Test portfolio sync (will show "No connections found")

### **Step 7: Exchange Integration Setup**

#### **7.1 Binance API Setup**
1. Go to [Binance](https://www.binance.com)
2. Log in to your account
3. Go to API Management
4. Create new API key
5. Enable "Enable Reading" and "Enable Futures"
6. Copy API Key and Secret

#### **7.2 Ethereum Wallet Setup**
1. Get your wallet address (MetaMask, etc.)
2. Add it to the settings page
3. The app will fetch ETH and ERC-20 tokens

### **Step 8: Production Deployment**

#### **8.1 Deploy Backend to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy
railway up
```

#### **8.2 Deploy Frontend to GitHub Pages**
```bash
# Create GitHub repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/koinlytics.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Source: Deploy from branch → main → / (root)
```

#### **8.3 Update Production URLs**
After deployment, update the API URLs in your frontend files to point to your Railway backend.

## 🔧 Configuration

### **Environment Variables Reference**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ | `https://abc123.supabase.co` |
| `SUPABASE_KEY` | Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `ALCHEMY_API_KEY` | Alchemy API key for Ethereum data | ✅ | `demo` |
| `PORT` | Server port | ❌ | `8080` (default) |
| `NODE_ENV` | Environment mode | ❌ | `development` (default) |

### **API Endpoints**

#### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/logout` - User logout

#### **Portfolio Management**
- `GET /api/sync-portfolio` - Synchronize portfolio data
- `GET /api/coin-details/:coinId` - Get asset information
- `GET /api/historical-data-24h/:coinId` - Get price history

#### **Admin Functions**
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users/:userId` - Delete user

### **Rate Limiting Configuration**
```javascript
// CoinGecko API: 1 second between requests
const COINGECKO_RATE_LIMIT = 1000; // milliseconds

// Data cache: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // milliseconds
```

## 📱 User Interface

### **Dashboard Features**
- **Portfolio Overview**: Total value, 24h/7d/30d changes
- **Performance Charts**: Interactive time-series visualizations
- **Asset Management**: Easy navigation between holdings
- **Real-Time Updates**: Live data synchronization

### **Admin Panel**
- **User Management**: Create, view, and delete users
- **System Statistics**: User counts and activity metrics
- **Role Management**: Admin and user permission control
- **Quick Actions**: Efficient user administration

### **Keyboard Shortcuts**
- `Ctrl + Shift + A` - Go to Admin Panel
- `Ctrl + Shift + D` - Go to Dashboard
- `Ctrl + Shift + R` - Refresh data
- `Ctrl + Shift + S` - Go to Settings

### **Responsive Design**
- **Desktop**: Full-featured interface with sidebars
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile interface

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt encryption
- **Role-Based Access**: Granular permission control
- **Session Validation**: Secure token verification

### **Data Protection**
- **API Key Encryption**: Secure storage of exchange keys
- **Input Validation**: SQL injection prevention
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API abuse prevention

## 📊 Performance Optimizations

### **Caching Strategy**
- **Market Data Cache**: 5-minute cache for API responses
- **Chart Rendering**: Efficient Chart.js optimization
- **DOM Management**: Smart element cleanup and recreation
- **Memory Management**: Proper chart destruction

### **API Optimization**
- **Parallel Requests**: Concurrent API calls
- **Error Handling**: Graceful degradation
- **Retry Logic**: Automatic retry on failures
- **Fallback Data**: Mock data when APIs fail

## 🚀 Deployment

### **Production Environment Setup**

#### **Railway Backend Deployment**
```bash
# Set production environment variables
railway variables NODE_ENV=production
railway variables PORT=3000

# Deploy
railway up

# Get your public URL
railway domain
```

#### **GitHub Pages Frontend Deployment**
1. Push code to GitHub
2. Go to Settings → Pages
3. Source: Deploy from branch → main → / (root)
4. Wait for deployment (2-5 minutes)

### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
ALCHEMY_API_KEY=your_production_alchemy_key
```

### **CORS Configuration for Production**
Update your backend CORS settings to allow your production frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://yourusername.github.io',
    'https://yourdomain.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Docker Support**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### **Backend API Testing**
```bash
# Test if server is running
curl http://localhost:8080

# Test portfolio sync (requires auth token)
curl -X GET "http://localhost:8080/api/sync-portfolio" \
  -H "Authorization: Bearer your_token"

# Test coin details (public endpoint)
curl -X GET "http://localhost:8080/api/coin-details/bitcoin"
```

### **Frontend Testing**
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Various screen sizes and devices
- **Performance Testing**: Lighthouse and PageSpeed Insights

### **Integration Testing**
```bash
# Test complete flow
1. Start backend: npm start
2. Start frontend: python -m http.server 8000
3. Open http://localhost:8000/frontend/
4. Sign up as admin@bypass.com
5. Test admin panel functionality
6. Sign up as regular user
7. Test dashboard functionality
```

## 🤝 Contributing

### **Development Setup**
```bash
# Fork the repository
git clone https://github.com/yourusername/koinlytics.git
cd koinlytics

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Create Pull Request
```

### **Code Standards**
- **JavaScript**: ES6+ syntax, consistent formatting
- **CSS**: Tailwind utility classes, custom CSS for complex components
- **HTML**: Semantic markup, accessibility compliance
- **Documentation**: Clear comments and README updates

## 📈 Roadmap

### **Phase 1: Core Features** ✅
- [x] Multi-exchange integration
- [x] Real-time portfolio tracking
- [x] Basic charting and analytics
- [x] User authentication system

### **Phase 2: Advanced Analytics** ✅
- [x] Multi-time period charts
- [x] Portfolio distribution visualization
- [x] AI-powered insights
- [x] Performance metrics

### **Phase 3: Enhanced Features** 🚧
- [ ] Tax reporting and calculations
- [ ] Portfolio rebalancing tools
- [ ] Advanced trading signals
- [ ] Mobile app development

### **Phase 4: Enterprise Features** 📋
- [ ] Multi-user portfolios
- [ ] Advanced reporting
- [ ] API rate limit management
- [ ] Custom integrations

## 🐛 Troubleshooting

### **Common Setup Issues**

#### **1. "Module not found" Errors**
```bash
# Solution: Reinstall dependencies
cd koinlytics-backend
rm -rf node_modules package-lock.json
npm install
```

#### **2. "Cannot connect to Supabase"**
```bash
# Check your .env file
cat .env | grep SUPABASE

# Verify Supabase project is active
# Check if you're on the correct plan
```

#### **3. "Port already in use"**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=8081
```

#### **4. "CORS error" in browser**
```bash
# Check CORS configuration in backend
# Ensure frontend URL is in allowed origins
# Restart backend after changes
```

#### **5. "Charts not rendering"**
- Clear browser cache
- Check browser console for errors
- Verify Chart.js library loading
- Ensure canvas elements exist in DOM

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm start

# Check detailed logs
tail -f logs/app.log

# Use browser developer tools
# Check Network tab for API calls
# Check Console for JavaScript errors
```

### **Performance Issues**
```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8080/api/sync-portfolio"

# Monitor memory usage
node --inspect index.js

# Use Chrome DevTools for frontend profiling
```

## 📚 API Documentation

### **Authentication**
All API requests require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

### **Response Format**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Error Handling**
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Rate Limits**
- **CoinGecko API**: 50 calls/minute (free tier)
- **Alchemy API**: Varies by plan
- **Binance API**: 1200 requests/minute
- **Internal API**: No limits (your server)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko**: Cryptocurrency market data
- **Chart.js**: Charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service platform
- **Alchemy**: Ethereum blockchain data

## 📞 Support

### **Getting Help**
1. **Check this README** - Most issues are covered here
2. **Search GitHub Issues** - Look for similar problems
3. **Create New Issue** - Provide detailed error information
4. **Join Discussions** - Community support and ideas

### **Contact Information**
- **Documentation**: [Wiki](https://github.com/yourusername/koinlytics/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/koinlytics/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/koinlytics/discussions)
- **Email**: support@koinlytics.com

### **Community Resources**
- **Discord Server**: [Join our community](https://discord.gg/koinlytics)
- **YouTube Tutorials**: [Setup guides](https://youtube.com/@koinlytics)
- **Blog**: [Latest updates](https://blog.koinlytics.com)

---

<div align="center">

**Made with ❤️ by the Koinlytics Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/koinlytics?style=social)](https://github.com/yourusername/koinlytics)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/koinlytics?style=social)](https://github.com/yourusername/koinlytics)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/koinlytics)](https://github.com/yourusername/koinlytics/issues)

**⭐ Star this repository if it helped you!**

</div>
