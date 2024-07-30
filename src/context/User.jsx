import React, { useState } from "react";
import { createContext, useContext } from "react";
const user = createContext();
export const User = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("USERS")) || {
      userDetails: null,
      token: "",
      mode: "Buying",
    }
  );
  return (
    <user.Provider value={[userInfo, setUserInfo]}>{children}</user.Provider>
  );
};

export const useUser = () => useContext(user);
