import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUserData(response.data);
    } catch {
      localStorage.removeItem("token");
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email, password, role) => {
    try {
      const response = await api.post("/auth/login", { email, password, role });
      localStorage.setItem("token", response.data.token);
      setUserData(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.msg || "Login failed.",
      };
    }
  };

  const register = async (data, role) => {
    try {
      const endpoint = role === "owner" ? "/auth/register/owner" : "/auth/register/user";
      const response = await api.post(endpoint, data);
      return { success: true, message: response.data.message };
    } catch (error) {
      const validation = error.response?.data?.errors?.[0]?.msg;
      return {
        success: false,
        error: validation || error.response?.data?.message || "Registration failed.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  const isAuthenticated = !!userData && !!localStorage.getItem("token");
  const isOwner = userData?.role === "owner";
  const isUser = userData?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        userData,
        isLoading,
        isAuthenticated,
        isOwner,
        isUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}