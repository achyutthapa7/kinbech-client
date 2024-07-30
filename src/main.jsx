import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { User } from "./context/User.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Product } from "./context/Product.jsx";
import { Cartcontext } from "./context/Cartcontext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    <Cartcontext>
      <Product>
        <User>
          <App />
          <Toaster />
        </User>
      </Product>{" "}
    </Cartcontext>
  </BrowserRouter>
);
