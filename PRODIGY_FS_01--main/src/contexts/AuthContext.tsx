import React, { createContext, useContext, useEffect, useState } from 'react'
import { MockAuthService, initializeMockAuth } from '../lib/mockAuth'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: Date
  emailVerified?: boolean
}

interface Session {
  access_token: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authService, setAuthService] = useState<MockAuthService | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const service = await initializeMockAuth()
        setAuthService(service)
        const token = localStorage.getItem('auth_token')
        if (token) {
          const decoded = service.verifyToken(token)
          if (decoded) {
            const userData = await service.getUserById(decoded.userId)
            if (userData) {
              setUser(userData)
              setSession({ access_token: token })
            } else {
              localStorage.removeItem('auth_token')
            }
          } else {
            localStorage.removeItem('auth_token')
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!authService) {
      return { error: { message: 'Authentication service not initialized' } }
    }
    setLoading(true)
    try {
      const result = await authService.signUp(email, password, firstName, lastName)
      if (result.error) return result
      if (result.data) {
        setUser(result.data.user)
        setSession(result.data.session)
        localStorage.setItem('auth_token', result.data.session.access_token)
      }
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!authService) {
      return { error: { message: 'Authentication service not initialized' } }
    }
    setLoading(true)
    try {
      const result = await authService.signIn(email, password)
      if (result.error) return result
      if (result.data) {
        setUser(result.data.user)
        setSession(result.data.session)
        localStorage.setItem('auth_token', result.data.session.access_token)
      }
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      setUser(null)
      setSession(null)
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    if (!authService) {
      return { error: { message: 'Authentication service not initialized' } }
    }
    try {
      return await authService.resetPassword(email)
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const updateProfile = async (data: { firstName?: string; lastName?: string }) => {
    if (!authService || !user) {
      return { error: { message: 'Authentication service not initialized or user not logged in' } }
    }
    try {
      const result = await authService.updateProfile(user.id, data)
      if (!result.error && user) {
        setUser({
          ...user,
          ...data
        })
      }
      return result
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}