# VitaApp Setup & Deployment Guide

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Required software
- Node.js 18+ 
- npm or yarn
- Git
```

### 2. Initial Setup
```bash
# Clone and setup
git clone https://github.com/yourusername/vitadasingle.git
cd vitadasingle/frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Development
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 📋 Pre-Deployment Checklist

### Windows Users
```powershell
# Run pre-deployment checks
.\scripts\pre-deploy.ps1
```

### Linux/Mac Users
```bash
# Run pre-deployment checks
chmod +x scripts/pre-deploy.sh
./scripts/pre-deploy.sh
```

## 🌍 Vercel Deployment

### Automatic Setup
```bash
# Windows
.\scripts\setup-vercel.ps1

# Linux/Mac
chmod +x scripts/setup-vercel.sh
./scripts/setup-vercel.sh
```

### Manual Setup
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Environment Variables** (set in Vercel dashboard)
   ```
   VITE_API_URL=https://your-api-domain.com/api
   VITE_APP_NAME=VitaApp
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_ERROR_REPORTING=false
   ```

## 🛠️ AI Coding Guidelines Compliance

### ✅ Code Standards
- All code written in **English**
- Comments and documentation in **English**
- Variables, functions, classes use **English names**

### 📅 Date Format Standards
- Storage format: **ISO 8601** (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`)
- Display format: **Localized** based on user language
- Use utilities: `dateHelpers.ts` and `formatters.ts`

### 🌐 Internationalization
- Primary language: **English (en-US)**
- Secondary language: **Italian (it-IT)**
- UI text uses translation keys: `t('key.subkey')`
- Fallback to English if translation missing

### 📁 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── modals/         # Modal components
├── context/            # React Context providers
├── features/           # Feature-based organization
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

## 🔧 Development Tools

### TypeScript Configuration
- Strict type checking enabled
- Path aliases configured (`@/` for `src/`)
- Comprehensive type definitions

### ESLint Configuration
- React recommended rules
- TypeScript support
- Custom rules for AI Guidelines compliance

### Vite Configuration
- Fast development server
- Hot module replacement
- Optimized production builds

## 🧪 Testing

### Unit Tests (Future)
```bash
# Run tests
npm run test

# Test coverage
npm run test:coverage
```

### E2E Tests (Future)
```bash
# Run e2e tests
npm run test:e2e
```

## 📦 Build & Deployment

### Local Build
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

### CI/CD Pipeline
- GitHub Actions configured
- Automatic deployment on push to main
- Code quality checks
- AI Guidelines compliance verification

## 🔍 Code Quality Checks

### Pre-commit Hooks
```bash
# Install husky (optional)
npm install --save-dev husky
npm run prepare
```

### Manual Checks
```bash
# English code compliance
grep -r "//.*[àèìòù]" src/

# ISO 8601 date compliance
grep -r "new Date.*[0-9]*/[0-9]*/[0-9]*" src/

# Translation key usage
grep -r "\"[A-Z][a-z].*\"" src/components/
```

## 📊 Monitoring & Analytics

### Development Tools
```bash
# Bundle analyzer
npm run build:analyze

# Performance profiling
npm run build:profile
```

### Production Monitoring
- Vercel Analytics (optional)
- Error reporting with Sentry (optional)
- Performance monitoring (optional)

## 🔧 Environment Configuration

### Development (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=VitaApp
VITE_APP_VERSION=1.0.0
VITE_DEV_TOOLS=true
VITE_LOG_LEVEL=debug
```

### Production (Vercel)
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=VitaApp
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

## 🚨 Troubleshooting

### Common Issues

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **ESLint Errors**
   ```bash
   npm run lint
   npm run lint:fix
   ```

3. **Build Failures**
   ```bash
   npm run clean-cache
   npm install
   npm run build
   ```

4. **Vercel Deployment Issues**
   ```bash
   # Check vercel logs
   vercel logs
   
   # Redeploy
   vercel --prod --force
   ```

### Getting Help

- Check the [AI Coding Guidelines](AI_CODING_GUIDELINES.md)
- Review the [README](README.md)
- Open an issue on GitHub
- Check Vercel documentation

## 📈 Performance Optimization

### Bundle Size
- Use dynamic imports for route-based code splitting
- Optimize images and assets
- Use Vite's built-in optimizations

### Runtime Performance
- Implement React.memo for expensive components
- Use useMemo and useCallback appropriately
- Optimize re-renders with proper key props

## 🔄 Updates & Maintenance

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install package@latest
```

### Version Management
- Follow semantic versioning
- Update version in package.json
- Tag releases in git

## 🎯 Next Steps

1. **Setup GitHub Repository**
   ```bash
   git remote add origin https://github.com/yourusername/vitadasingle.git
   git push -u origin main
   ```

2. **Configure Vercel**
   - Connect GitHub repository
   - Set environment variables
   - Configure domain

3. **Enable CI/CD**
   - GitHub Actions will run automatically
   - Set up Vercel secrets for deployment

4. **Monitor & Maintain**
   - Regular dependency updates
   - Performance monitoring
   - User feedback integration

---

*Last updated: 2025-07-03*
*Version: 1.0.0*
