# SecureApp - MongoDB Authentication System

A modern, secure authentication system built with React, TypeScript, and MongoDB. Features a beautiful UI with comprehensive user management capabilities.

## 🚀 Features

- **User Authentication**: Sign up, sign in, and sign out functionality
- **Password Management**: Secure password hashing with bcrypt
- **JWT Tokens**: Stateless authentication with JSON Web Tokens
- **Password Reset**: Email-based password reset functionality
- **User Profiles**: Update user information
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: JWT, bcryptjs
- **Database**: MongoDB (with mock service for development)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_JWT_SECRET=czSQzHrZsgxTbt6AVVPu8IfViRtBn+ybUdJSqpUbbfA
   VITE_MONGODB_URI=mongodb://localhost:27017/secureapp
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

### Option 1: Mock Database (Development)
The app includes a mock authentication service that works without a MongoDB server. This is perfect for development and testing.

### Option 2: Real MongoDB (Production)
To use a real MongoDB database:

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update the environment variables** with your MongoDB connection string
3. **Switch to real MongoDB service** by updating the import in `src/contexts/AuthContext.tsx`:
   ```typescript
   // Change from:
   import { MockAuthService, initializeMockAuth } from '../lib/mockAuth'
   
   // To:
   import { AuthService, initializeDatabase } from '../lib/mongodb'
   ```

## 🔐 Authentication Flow

1. **Sign Up**: Users can create accounts with email, password, and optional name fields
2. **Sign In**: Secure login with email and password
3. **JWT Tokens**: Authentication tokens are stored in localStorage
4. **Protected Routes**: Dashboard access requires authentication
5. **Password Reset**: Email-based password reset functionality

## 📱 Pages

- **Login Page**: User authentication with demo account option
- **Register Page**: User registration with password strength indicator
- **Dashboard**: Protected page with user stats and activity feed
- **Forgot Password**: Password reset functionality

## 🎨 UI Components

- **FormInput**: Reusable form input with validation
- **Toast**: Notification system for user feedback
- **PasswordStrength**: Real-time password validation
- **ProtectedRoute**: Route protection with loading states
- **ErrorBoundary**: Error handling and recovery

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (AuthContext)
├── lib/               # Database and utility functions
├── pages/             # Page components
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages
- **Protected Routes**: Authentication-based access control

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Set up environment variables** on your hosting platform

4. **Configure MongoDB** (if using real database)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This is a demonstration project. For production use, ensure you:
- Use a strong JWT secret
- Set up proper email services for password reset
- Configure CORS and security headers
- Use HTTPS in production
- Implement rate limiting
- Add proper logging and monitoring 