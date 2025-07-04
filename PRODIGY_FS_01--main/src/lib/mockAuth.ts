const mockUsers: any[] = []

export class MockAuthService {
  private static instance: MockAuthService

  private constructor() {}

  public static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService()
    }
    return MockAuthService.instance
  }

  // "Hash" password (insecure, for demo only)
  private async hashPassword(password: string): Promise<string> {
    return password // No hashing in browser
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return password === hashedPassword
  }

  // "Generate" token (insecure, for demo only)
  private generateToken(userId: string): string {
    return btoa(userId + ':' + Date.now())
  }

  public verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = atob(token)
      const userId = decoded.split(':')[0]
      return { userId }
    } catch {
      return null
    }
  }

  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    const existingUser = mockUsers.find(user => user.email === email.toLowerCase())
    if (existingUser) {
      return { error: { message: 'User already exists with this email' } }
    }
    const userId = Math.random().toString(36).substring(2, 15)
    const user = {
      _id: userId,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      createdAt: new Date(),
      emailVerified: true
    }
    mockUsers.push(user)
    const token = this.generateToken(userId)
    return {
      data: {
        user: {
          id: userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified
        },
        session: { access_token: token }
      },
      error: null
    }
  }

  async signIn(email: string, password: string) {
    const user = mockUsers.find(u => u.email === email.toLowerCase())
    if (!user) {
      return { error: { message: 'Invalid email or password' } }
    }
    const isValidPassword = await this.comparePassword(password, user.password)
    if (!isValidPassword) {
      return { error: { message: 'Invalid email or password' } }
    }
    const token = this.generateToken(user._id)
    return {
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified
        },
        session: { access_token: token }
      },
      error: null
    }
  }

  async getUserById(userId: string) {
    const user = mockUsers.find(u => u._id === userId)
    if (!user) return null
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified
    }
  }

  async resetPassword(email: string) {
    const user = mockUsers.find(u => u.email === email.toLowerCase())
    if (!user) {
      return { error: { message: 'User not found' } }
    }
    // Just a mock, no real reset
    return { error: null }
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = mockUsers.find(u => u._id === userId)
    if (!user) {
      return { error: { message: 'User not found' } }
    }
    if (data.firstName !== undefined) user.firstName = data.firstName
    if (data.lastName !== undefined) user.lastName = data.lastName
    return { error: null }
  }
}

export const initializeMockAuth = async () => {
  return MockAuthService.getInstance()
} 