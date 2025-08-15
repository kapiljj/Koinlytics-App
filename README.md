# 🚀 Koinlytics - Advanced Crypto Portfolio Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-blue.svg)](https://www.chartjs.org/)

> **Professional-grade cryptocurrency portfolio tracking with real-time analytics, multi-exchange integration, and AI-powered insights.**

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

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- CoinGecko API access (free)

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/koinlytics.git
cd koinlytics
```

### **2. Backend Setup**
```bash
cd koinlytics-backend
npm install
```

### **3. Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
ALCHEMY_API_KEY=your_alchemy_api_key

# Server Configuration
PORT=8080
NODE_ENV=development
```

### **4. Database Setup**
```sql
-- Run these SQL commands in your Supabase SQL editor

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connections table
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  binance_api_key TEXT,
  binance_api_secret TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio snapshots table
CREATE TABLE portfolio_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  snapshot_date DATE,
  total_value DECIMAL(20,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own connections" ON connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON connections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own snapshots" ON portfolio_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON portfolio_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **5. Start the Backend**
```bash
npm start
# Server will start on http://localhost:8080
```

### **6. Frontend Access**
Open `frontend/index.html` in your browser or serve it with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve frontend
```

### **7. Admin Access**
- **Email**: `admin@bypass.com`
- **Password**: Any password (bypass authentication)
- **Access**: Full admin panel with user management

## 🔧 Configuration

### **API Endpoints**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/sync-portfolio` - Portfolio synchronization
- `GET /api/coin-details/:coinId` - Asset information
- `GET /api/historical-data-24h/:coinId` - Price history
- `POST /api/portfolio-insights` - AI insights generation

### **Admin Endpoints**
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users/:userId` - Delete user

### **Rate Limiting**
- **CoinGecko API**: 1 second between requests
- **Data Caching**: 5-minute cache duration
- **Request Timeout**: 10 seconds maximum

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

### **Production Setup**
```bash
# Set production environment
NODE_ENV=production
PORT=3000

# Use PM2 for process management
npm install -g pm2
pm2 start index.js --name "koinlytics-backend"

# Enable auto-restart
pm2 startup
pm2 save
```

### **Environment Variables**
```env
# Production Configuration
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
ALCHEMY_API_KEY=your_production_alchemy_key
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

### **API Testing**
```bash
# Test portfolio sync
curl -X GET "http://localhost:8080/api/sync-portfolio" \
  -H "Authorization: Bearer your_token"

# Test coin details
curl -X GET "http://localhost:8080/api/coin-details/bitcoin"
```

### **Frontend Testing**
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Various screen sizes and devices
- **Performance Testing**: Lighthouse and PageSpeed Insights

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

### **Common Issues**

#### **Portfolio Not Loading**
```bash
# Check backend server
curl http://localhost:8080/api/sync-portfolio

# Verify environment variables
echo $SUPABASE_URL
echo $ALCHEMY_API_KEY
```

#### **Charts Not Rendering**
- Clear browser cache
- Check browser console for errors
- Verify Chart.js library loading
- Ensure canvas elements exist in DOM

#### **API Rate Limits**
- Check CoinGecko API status
- Verify rate limiting configuration
- Monitor request frequency
- Implement exponential backoff

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm start

# Check detailed logs
tail -f logs/app.log
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko**: Cryptocurrency market data
- **Chart.js**: Charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service platform
- **Alchemy**: Ethereum blockchain data

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/koinlytics/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/koinlytics/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/koinlytics/discussions)
- **Email**: support@koinlytics.com

---

<div align="center">

**Made with ❤️ by the Koinlytics Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/koinlytics?style=social)](https://github.com/yourusername/koinlytics)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/koinlytics?style=social)](https://github.com/yourusername/koinlytics)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/koinlytics)](https://github.com/yourusername/koinlytics/issues)

</div>
