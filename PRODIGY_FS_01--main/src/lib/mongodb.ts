import { MongoClient, Db } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// MongoDB connection string - you can set this in your .env file
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017'
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-change-this-in-production'

let client: MongoClient
let db: Db

// Connect to MongoDB
export const connectToDatabase = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db('secureapp')
      console.log('Connected to MongoDB')
    }
    return db
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.')
  }
  return db
}

// User interface
export interface User {
  _id?: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
  emailVerified?: boolean
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

// Authentication service
export class AuthService {
  private static instance: AuthService
  private db: Db

  private constructor() {
    this.db = getDatabase()
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Compare password
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  }

  // Verify JWT token
  public verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string }
    } catch (error) {
      return null
    }
  }

  // Sign up user
  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    try {
      const usersCollection = this.db.collection<User>('users')
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return { error: { message: 'User already exists with this email' } }
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password)

      // Create user
      const user: Omit<User, '_id'> = {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false
      }

      const result = await usersCollection.insertOne(user)
      
      if (result.insertedId) {
        const token = this.generateToken(result.insertedId.toString())
        return { 
          data: { 
            user: { 
              id: result.insertedId.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              createdAt: user.createdAt
            },
            session: { access_token: token }
          },
          error: null 
        }
      }

      return { error: { message: 'Failed to create user' } }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: { message: 'An error occurred during sign up' } }
    }
  }

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const usersCollection = this.db.collection<User>('users')
      
      // Find user by email
      const user = await usersCollection.findOne({ email: email.toLowerCase() })
      if (!user) {
        return { error: { message: 'Invalid email or password' } }
      }

      // Check password
      const isValidPassword = await this.comparePassword(password, user.password)
      if (!isValidPassword) {
        return { error: { message: 'Invalid email or password' } }
      }

      // Generate token
      const token = this.generateToken(user._id!.toString())

      return {
        data: {
          user: {
            id: user._id!.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt
          },
          session: { access_token: token }
        },
        error: null
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'An error occurred during sign in' } }
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const usersCollection = this.db.collection<User>('users')
      const user = await usersCollection.findOne({ _id: userId })
      
      if (!user) {
        return null
      }

      return {
        id: user._id!.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified
      }
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const usersCollection = this.db.collection<User>('users')
      
      // Find user by email
      const user = await usersCollection.findOne({ email: email.toLowerCase() })
      if (!user) {
        return { error: { message: 'User not found' } }
      }

      // Generate reset token (in a real app, you'd send this via email)
      const resetToken = Math.random().toString(36).substring(2, 15)
      const resetExpires = new Date(Date.now() + 3600000) // 1 hour

      // Update user with reset token
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
            updatedAt: new Date()
          }
        }
      )

      // In a real app, you would send an email here
      console.log(`Password reset token for ${email}: ${resetToken}`)

      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: { message: 'An error occurred while resetting password' } }
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    try {
      const usersCollection = this.db.collection<User>('users')
      
      const result = await usersCollection.updateOne(
        { _id: userId },
        { 
          $set: { 
            ...data,
            updatedAt: new Date()
          }
        }
      )

      if (result.modifiedCount > 0) {
        return { error: null }
      }

      return { error: { message: 'Failed to update profile' } }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: { message: 'An error occurred while updating profile' } }
    }
  }
}

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await connectToDatabase()
    return AuthService.getInstance()
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
} 