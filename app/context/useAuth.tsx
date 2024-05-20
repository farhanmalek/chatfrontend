import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/UserModel";
import { useRouter } from "next/navigation";
import { loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

//custom hook
type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, userName: string, password: string) => void;
  loginUser: (userName: string, password: string) => void;
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
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer" + token //add bearer token to every single api request 
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    userName: string,
    password: string
  ) => {
    try {
      const response = await registerAPI(email, userName, password);
      if (response) {
        localStorage.setItem("token", response?.data.token);
        const userObj = {
          userName: response?.data.userName,
          email: response?.data.email,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(response?.data.token);
        setUser(userObj!);
        toast.success("Login Success!");
        router.push("/login");
      }
    } catch (error) {
        toast.warning("Server Error Occured")
    }
  };
  const loginUser = async (
    userName: string,
    password: string
  ) => {
    try {
      const response = await loginAPI(userName, password);
      if (response) {
        localStorage.setItem("token", response?.data.token);
        const userObj = {
          userName: response?.data.userName,
          email: response?.data.email,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(response?.data.token);
        setUser(userObj!);
        toast.success("Login Success!");
        router.push("/");
      }
    } catch (error) {
        toast.warning("Server Error Occured")
    }
  };

  const isLoggedIn = () => {
     return !!user;
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken("")
    router.push("/login")
  }

  return (
    <UserContext.Provider value= {{loginUser, user, token, isLoggedIn, registerUser, logout}}>
        {
            isReady ? children : null
        }
    </UserContext.Provider>
  )


};

export const useAuth = () => React.useContext(UserContext)

