'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType } from '@/types'
import { apiClient } from '@/lib/api/client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const currentUser = await apiClient.getMe()
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        localStorage.removeItem('auth_token')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const currentUser = await apiClient.login(email, password)
      setUser(currentUser)
      setIsAuthenticated(true)
      
      // Store mock token
      localStorage.setItem('auth_token', 'mock_token_' + Date.now())
      localStorage.setItem('user', JSON.stringify(currentUser))
    } catch (error) {
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
