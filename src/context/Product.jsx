import React, { createContext, useContext, useEffect, useState } from "react";
const productContext = createContext();
export const Product = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    const fetchAllProduct = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URL}/fetchAllProduct`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log(`Response status: ${res.status}`);
      console.log(`Response headers: ${JSON.stringify(res.headers)}`);

      if (res.status === 200) {
        const data = await res.json();
        setAllProducts(data);
      } else {
        const errorData = await res.json();
        console.error(
          `Failed to fetch products: ${res.status} - ${errorData.message}`
        );
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
