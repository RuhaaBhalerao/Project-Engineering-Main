import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

/**
 * AuthProvider provides the authentication state to the application.
 * Fixed: Now properly persists and restores auth state from localStorage
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Login: Store user data and token in state AND localStorage
  const login = (userData, fakeToken) => {
    setUser(userData)
    setToken(fakeToken)
    localStorage.setItem('authToken', fakeToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
    console.log('✅ User logged in:', userData.email)
  }

  // Logout: Clear state AND remove from localStorage
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    console.log('🚪 User logged out')
  }

  // Restore auth state from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      console.log('✅ User session restored from localStorage')
    }
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
