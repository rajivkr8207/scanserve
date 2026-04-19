import { connectDB } from '@/lib/db'
import { signToken } from '@/lib/auth'
import User from '@/models/User'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    await connectDB()

    const existing = await User.findOne({ email: input.email.toLowerCase() })
    if (existing) {
      throw new Error('An account with this email already exists')
    }

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password, // hashed by pre-save hook
      role: 'SELLER',
    })

    const token = signToken({ userId: String(user._id), email: user.email, role: user.role })

    return {
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    await connectDB()

    // Explicitly select password (it is excluded by default)
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password')
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isMatch = await user.comparePassword(input.password)
    if (!isMatch) {
      throw new Error('Invalid email or password')
    }

    const token = signToken({ userId: String(user._id), email: user.email, role: user.role })

    return {
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    }
  },

  async getProfile(userId: string) {
    await connectDB()
    const user = await User.findById(userId).select('-password')
    if (!user) throw new Error('User not found')
    return user
  },
}
