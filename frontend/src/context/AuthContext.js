import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const login = (token, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);

  setIsLoggedIn(true);
};


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout,
      userName: localStorage.getItem("name"),
      userEmail: localStorage.getItem("email")
    }}>
      {children}
    </AuthContext.Provider>
  );
}
