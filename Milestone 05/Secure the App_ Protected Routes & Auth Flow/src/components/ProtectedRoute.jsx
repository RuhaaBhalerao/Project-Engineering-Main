import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute component.
 * Redirects unauthenticated users to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const auth = useAuth()
  const isAuthenticated = auth?.isAuthenticated

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
