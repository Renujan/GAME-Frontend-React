import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/authService";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  score: number;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  loginStep1: (username: string, password: string) => Promise<{ otp_sent: boolean; email: string }>;
  loginStep2: (email: string, otp: string) => Promise<void>;
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
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure coins field exists with fallback
        if (parsedUser && typeof parsedUser.coins !== 'number') {
          parsedUser.coins = 100;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const loginStep1 = async (username: string, password: string) => {
    const response = await authService.loginStep1({ username, password });
    return response;
  };

  const loginStep2 = async (email: string, otp: string) => {
    const response = await authService.verifyOtp({ email, otp });

    // Store tokens
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    // Store user data (if provided by backend, otherwise create minimal user object)
    // Ensure coins defaults to 100 for new users
    const userData: User = response.user ? {
      ...response.user,
      role: response.user.role || "player",
      score: response.user.score || 0,
      coins: response.user.coins || 100
    } : {
      id: 0,
      username: "",
      email,
      role: "player",
      score: 0,
      coins: 100
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });

    // Store tokens
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    // Store user data (if provided by backend, otherwise create minimal user object)
    // Ensure coins defaults to 100 for new/existing users
    const userData: User = response.user ? {
      ...response.user,
      role: response.user.role || "player",
      score: response.user.score || 0,
      coins: response.user.coins || 100
    } : {
      id: 0,
      username,
      email: "",
      role: "player",
      score: 0,
      coins: 100
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
        setUser,
        isAuthenticated: !!user,
        loginStep1,
        loginStep2,
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
