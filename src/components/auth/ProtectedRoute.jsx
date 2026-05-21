import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
