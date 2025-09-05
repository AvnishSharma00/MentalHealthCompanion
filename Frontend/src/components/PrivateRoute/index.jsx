import { Navigate } from "react-router-dom"
import { useLogin } from "../../context/login-context"

export const Privateroute = ({ children, allowedRole }) => {
  const { isloggedin, loading, role } = useLogin()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isloggedin) {
    return <Navigate to="/login" />
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />
  }

  return children
}