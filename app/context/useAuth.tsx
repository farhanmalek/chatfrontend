import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/UserModel";
import { useRouter } from "next/navigation";
import { loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

// Custom hook
type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, userName: string, password: string) => Promise<void>;
  loginUser: (userName: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (email: string, userName: string, password: string) => {
    try {
      const response = await registerAPI(email, userName, password);
      if (response) {
        localStorage.setItem("token", response.data.token);
        const userObj = {
          userId: response.data.userId, // Add the missing userId property
          userName: response.data.userName,
          email: response.data.email,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(response.data.token);
        setUser(userObj);
        toast.success("Registration Successful!");
        router.push("/login");
      }
    } catch (error) {
      toast.warning("Server Error Occurred");
    }
  };

  const loginUser = async (userName: string, password: string) => {
    try {
      const response = await loginAPI(userName, password);
      if (response) {
        localStorage.setItem("token", response.data.token);
        const userObj = {
          userId: response.data.userId, // Add the missing userId property
          userName: response.data.userName,
          email: response.data.email,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(response.data.token);
        setUser(userObj);
        toast.success("Login Success!");
        router.push("/");
      }
    } catch (error) {
      toast.warning("Server Error Occurred");
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null); // Set token to null instead of an empty string
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ loginUser, user, token, isLoggedIn, registerUser, logout }}>
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
