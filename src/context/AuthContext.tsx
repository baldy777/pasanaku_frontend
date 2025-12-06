import { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  correo: string;
  nombre: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  hasRole: () => false,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      verifyToken(storedToken);
    }

    setLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (!response.ok) {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
