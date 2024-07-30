import React, { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";
const cart = createContext();
export const Cartcontext = ({ children }) => {
  const [CartInfo, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("CART")) || []
  );
  return <cart.Provider value={[CartInfo, dispatch]}>{children}</cart.Provider>;
};
export const useCart = () => useContext(cart);
