/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (stored) {
      setToken(stored);
      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (token: string, userlogin: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userlogin));
    setToken(token);
    setUser(userlogin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
