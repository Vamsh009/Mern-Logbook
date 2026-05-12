import api from "../lib/axios";
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const restoreUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.user)
      } catch {
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    restoreUser();
  }, [])
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  }
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);