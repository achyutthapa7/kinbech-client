import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/nav/Nav";
import Modal from "./components/modal/Modal";
import Sidebar from "./components/sidebar/Sidebar";
import Cart from "./components/cart/Cart";
import Verification from "./components/verification/Verification";
import Notfound from "./components/notfound/Notfound";
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Addproduct from "./components/addproduct/Addproduct";
import Allproduct from "./components/allproducts/Allproduct";
import Updateproduct from "./components/allproducts/Updateproduct";
import Payment from "./components/payment/Payment";
import Success from "./components/Success";
import Cancel from "./components/cancel/Cancel";
const App = () => {
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <div className="relative">
      <Modal modal={modal} setModal={setModal} />
      <Nav setModal={setModal} menu={menu} setMenu={setMenu} />
      <Sidebar menu={menu} />

      <Routes>
        <Route path="/" element={<Home setModal={setModal} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="addproduct" element={<Addproduct />} />
          <Route path="allproduct" element={<Allproduct />} />
          <Route path="allproduct/updateproduct" element={<Updateproduct />} />
        </Route>
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
};

export default App;