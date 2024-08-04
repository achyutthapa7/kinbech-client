import React, { createContext, useContext, useEffect, useState } from "react";
const productContext = createContext();
export const Product = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    const fetchAllProduct = async () => {
      const res = await fetch(`${import.meta.env.VITE_PRODUCTION_URL}/fetchAllProduct`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 200) {
        const data = await res.json();
        setAllProducts(data);
      }
    };
    fetchAllProduct();
  }, [allProducts, setAllProducts]);
  return (
    <productContext.Provider value={[allProducts, setAllProducts]}>
      {children}
    </productContext.Provider>
  );
};

export const useAllProducts = () => useContext(productContext);
