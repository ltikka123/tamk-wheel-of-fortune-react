import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { COOKIE_TOKEN } from "../Definitions";

type AuthContextType = {
  isAuthenticated: boolean;
  username: any;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "",
  login: (token: string) => {},
  logout: () => {},
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem(COOKIE_TOKEN);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsAuthenticated(true);
        setUsername(decoded.username);
      } catch (error) {
        console.error("Token invalid:", error);
        localStorage.removeItem(COOKIE_TOKEN);
      }
    }
  }, []);

  // save token to a cookie
  const login = (token: string) => {
    localStorage.setItem(COOKIE_TOKEN, token);
    const decoded: any = jwtDecode(token);
    setIsAuthenticated(true);
    setUsername(decoded.username);
  };

  // remove cookie and reset auth context
  const logout = () => {
    localStorage.removeItem(COOKIE_TOKEN);
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
