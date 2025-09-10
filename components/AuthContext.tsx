import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  password: string | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (
    username: string,
    email: string,
    password: string,
    callback?: () => void
  ) => { success: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load persisted login on mount
    const loadAuth = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedUsername && storedEmail && storedPassword) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    };
    loadAuth();
  }, []);

  const login = (emailInput: string, pwd: string): boolean => {
    const user = users.find(
      (u) => u.email === emailInput && u.password === pwd
    );
    console.log("user", user);

    if (user) {
      setIsAuthenticated(true);
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
      AsyncStorage.setItem("username", user.username);
      AsyncStorage.setItem("email", user.email);
      AsyncStorage.setItem("password", user.password);
      return true;
    } else {
      setIsAuthenticated(false);
      setUsername(null);
      setEmail(null);
      setPassword(null);
      AsyncStorage.removeItem("username");
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("password");
      return false;
    }
  };

  const signup = (
    username: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    if (users.some((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { username, email, password };
    setUsers((prev) => [...prev, newUser]);

    // Immediately log in the new user
    setIsAuthenticated(true);
    setUsername(username);
    setEmail(email);
    setPassword(password);
    AsyncStorage.setItem("username", username);
    AsyncStorage.setItem("email", email);
    AsyncStorage.setItem("password", password);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setEmail(null);
    setPassword(null);
    // AsyncStorage.removeItem("username");
    // AsyncStorage.removeItem("email");
    // AsyncStorage.removeItem("password");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        email,
        password,
        users,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
