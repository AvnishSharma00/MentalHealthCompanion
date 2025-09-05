import { useEffect, useState } from "react"
import { userDetail} from "../Api/userApi"  // backend call
import { useLogin } from "../context/login-context"

export const AuthInitializer = ({ children }) => {
  const { loginDispatch } = useLogin()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await userDetail() 
        console.log(data) // backend returns user info {email, role, ...}
        loginDispatch({ type: "LOG_IN", payload: data })
      
        console.log("✅ User authenticated:", data)
      } catch (err) {
        loginDispatch({ type: "LOG_OUT" })
        console.warn("❌ Auth failed:", err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return children
}