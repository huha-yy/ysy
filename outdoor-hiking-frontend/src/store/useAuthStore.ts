import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  hasRole: (role: string | string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      
      setAuth: (token, user) => {
        set({ token, user })
        localStorage.setItem('token', token)
      },
      
      clearAuth: () => {
        set({ token: null, user: null })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      },
      
      isAuthenticated: () => {
        return !!get().token
      },
      
      hasRole: (role) => {
        const user = get().user
        if (!user) return false
        
        if (Array.isArray(role)) {
          return role.includes(user.role)
        }
        return user.role === role
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

