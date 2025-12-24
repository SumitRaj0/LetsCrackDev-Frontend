# DevHub - React Frontend

A React application built with Vite, TypeScript, Tailwind CSS, and Auth0 authentication.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Auth0

1. Create an account at [Auth0](https://auth0.com/)
2. Create a new Application in your Auth0 Dashboard
3. Choose "Single Page Web Applications" as the application type
4. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
5. Copy your Auth0 Domain and Client ID

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience  # Optional, if using API
VITE_API_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=your-gemini-api-key  # Required for chatbot
VITE_APP_URL=http://localhost:5173
```

Copy `.env.example` to `.env` and fill in your values.

### 4. Enable Social Connections (Optional)

To enable Google login:
1. Go to Auth0 Dashboard > Authentication > Social
2. Enable Google connection
3. Configure your Google OAuth credentials

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Authentication Flow

- **Login/Signup Modal**: Click "Log in" or "Sign up" in the navbar to open the authentication modal
- **Google Login**: Click the Google sign-in button to authenticate with Google
- **Email/Password**: Use Auth0's Universal Login for email/password authentication
- **Protected Routes**: Dashboard routes require authentication
- **User Profile**: Authenticated users see their profile picture and name in the navbar

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable components (UI, layout, shared, auth)
- `src/modules/` - Feature modules
- `src/hooks/` - Custom React hooks
- `src/lib/` - Library utilities and constants
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `src/config/` - Configuration files (Auth0 config)

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Auth0 React SDK
- Tailwind CSS
- Google Gemini AI (for chatbot)
- Express.js (API server)

## Testing

### Running Tests

- **Watch Mode**: `npm run test` - Runs tests in watch mode (re-runs on file changes)
- **Single Run**: `npm run test:run` - Runs all tests once
- **Coverage Report**: `npm run test:coverage` - Generates coverage report
- **Coverage + Open**: `npm run test:coverage:open` - Generates coverage and opens HTML report in browser
- **Interactive UI**: `npm run test:ui` - Opens Vitest UI for interactive testing

### Viewing Coverage Report

After running `npm run test:coverage`, you can view the coverage report in two ways:

1. **Terminal Output**: A text summary is displayed in the terminal showing coverage percentages
2. **HTML Report**: Open `frontend/coverage/index.html` in your browser to see a detailed interactive coverage report
   - You can also use `npm run test:coverage:open` to automatically open it

**Note**: Unlike the backend (which uses Jest and generates reports at `backend/coverage/lcov-report/index.html`), the frontend uses Vitest and generates the HTML report directly at `frontend/coverage/index.html`.

## Code Quality

- **ESLint**: Configured with TypeScript and React rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
- **TypeScript**: Strict mode enabled
- **Vitest**: Fast unit testing framework with coverage support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run server` - Start API server
- `npm run dev:all` - Run both dev server and API server
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Generate test coverage report
- `npm run test:coverage:open` - Generate coverage and open HTML report in browser
- `npm run test:ui` - Open Vitest UI for interactive testing

## Features

- ✅ Auth0 Authentication (Google OAuth & Email/Password)
- ✅ Protected Routes
- ✅ User Profile Display
- ✅ Modal-based Login/Signup
- ✅ Responsive Design
- ✅ AI Chatbot with Gemini Integration
- ✅ Centralized Error Handling & Toast Notifications
- ✅ Code Quality Tools (ESLint, Prettier, Husky)
- ✅ Performance Optimized (Lazy Loading, Code Splitting)
- ✅ TypeScript with Strict Mode
- ✅ Dark Mode Support
