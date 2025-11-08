import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/authService";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("access_token");
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    
    // Store tokens
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);
    
    // Store user data (if provided by backend, otherwise create minimal user object)
    const userData: User = response.user ? {
      ...response.user,
      role: response.user.role || "player"
    } : {
      id: 0,
      username,
      email: "",
      role: "player"
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register({ username, email, password });
    
    // Auto-login after registration
    await login(username, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
