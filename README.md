# VitaApp - Personal Life Management System

A comprehensive React application for managing properties, vehicles, expenses, bookings, workouts, events, and documents. Built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Property Management**: Track real estate investments and residential properties
- **Vehicle Management**: Monitor vehicle maintenance, insurance, and expenses
- **Expense Tracking**: Categorize and analyze personal and business expenses
- **B&B Booking Management**: Handle vacation rental bookings and revenue
- **Workout Tracking**: Log fitness activities and monitor health progress
- **Event Management**: Schedule and organize personal and professional events
- **Document Storage**: Organize and categorize important documents
- **Multi-language Support**: Available in English and Italian

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Language Support**: English (primary), Italian

## 📁 Project Structure

```
vitadasingle/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── features/      # Feature-based organization
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── vercel.json        # Vercel deployment config
├── backend/               # Backend API (if applicable)
└── data/                  # Data files and exports
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vitadasingle.git
cd vitadasingle/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌍 Internationalization

The application supports multiple languages with automatic fallback:

- **English (en)**: Primary language and fallback
- **Italian (it)**: Secondary language

Translation keys follow a hierarchical structure for better organization.

## 📅 Date Handling

All dates are stored in ISO 8601 format following best practices:

- **Storage**: `2025-07-03` or `2025-07-03T17:45:00Z`
- **Display**: Automatically formatted based on user locale
- **Utilities**: Comprehensive date helpers for consistent handling

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
# Deploy 'dist' folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Guidelines

- All code written in English (identifiers, comments, documentation)
- ISO 8601 date format for all data storage
- TypeScript with strict type checking
- Functional components with hooks
- Proper error handling and loading states
- Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

For bug reports and feature requests, please open an issue on GitHub.

---

*VitaApp - Simplifying life management, one feature at a time.*
