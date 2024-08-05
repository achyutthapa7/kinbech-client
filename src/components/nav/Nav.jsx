import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useUser } from "../../context/User";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/Cartcontext";

const Nav = ({ setModal = () => {}, menu, setMenu = () => {} }) => {
  const [userInfo, setUserInfo] = useUser();
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();
  const [Cart] = useCart();
  const handleLogOut = () => {
    setUserInfo({ ...userInfo, userDetails: null, token: "" });
  };

  const handleForgetPassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URL}/forgetpassword`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(`Verfication code is sent to ${data.emailAddress}`);
        navigate("/settings/forgetpassword", { state: data });
      } else {
        toast.error("error");
      }
    } catch (error) {
      toast.error("Error sending verification code.");
    }
  };
  return (
    <nav className="bg-blue-500 py-8 px-5 sticky top-0 flex gap-5 items-center z-50">
      <div className="flex-1 flex gap-5 items-center">
        <Link to={"/"}>
          <p className="text-xl text-white font-medium">KINBECH</p>
        </Link>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search product..."
            className="outline-none rounded-md pl-2 py-2 w-full text-sm lg:flex hidden"
          />
          <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm lg:flex hidden" />
        </div>
      </div>
      <div className="flex-1 lg:flex justify-end items-center gap-10 hidden">
        {userInfo.mode === "Buying" && userInfo.userDetails && (
          <Link to={"/cart"} className="relative">
            <FaShoppingCart className="text-white text-xl cursor-pointer " />
            <span className="absolute -top-2 left-4 w-[15px] h-[15px] bg-red-600 text-white rounded-full flex items-center justify-center p-2 text-sm">
              {Cart.length}
            </span>
          </Link>
        )}
        <div>
          {userInfo.userDetails && userInfo.token ? (
            <div
              className="w-[40px] h-[40px] rounded-full bg-white cursor-pointer flex justify-center items-center relative"
              onClick={() => setDropDown(!dropDown)}
            >
              {userInfo.userDetails.userName[0]?.toUpperCase()}
              <div
                className={`transition-all delay-75 duration-100 absolute top-12 right-0 bg-white shadow-2xl rounded-lg p-2  ${
                  dropDown ? "h-auto w-[300px]" : "hidden"
                } overflow-hidden `}
              >
                {dropDown && (
                  <>
                    {userInfo.mode === "Buying" && (
                      <div className="flex flex-col items-center justify-center gap-6 h-auto text-xl ">
                        <button
                          className="transition-all delay-100 duration-100 hover:bg-green-600 hover:text-white px-7 py-2 rounded-md"
                          onClick={() => {
                            setUserInfo({ ...userInfo, mode: "Selling" });
                            toast("Switched to Selling");
                          }}
                        >
                          Sell product
                        </button>

                        <Link to={"/settings/updateusername"}>
                          <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline pb-2">
                            update username
                          </button>
                        </Link>
                        <Link to={"/settings/updatepassword"}>
                          <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline pb-2">
                            update password
                          </button>
                        </Link>
                        {/* <Link
                          to={"/settings/forgetpassword"}
                          onClick={handleForgetPassword}
                        >
                          <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline pb-2">
                            forget password
                          </button>
                        </Link> */}
                        <button
                          className="transition-all delay-100 duration-100 hover:bg-red-600 hover:text-white px-7 py-2 rounded-md"
                          onClick={() => {
                            handleLogOut();
                            toast("Logged Out successfully");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    {userInfo.mode === "Selling" && (
                      <div className="flex flex-col items-center justify-center gap-6 h-auto text-xl">
                        <button
                          className="transition-all delay-100 duration-100 hover:bg-green-600 hover:text-white px-7 py-2 rounded-md"
                          onClick={() => {
                            setUserInfo({ ...userInfo, mode: "Buying" });
                            toast("Switched to Buying");
                          }}
                        >
                          Buy product
                        </button>
                        <Link to={"/dashboard"}>
                          <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline">
                            Go to dashboard
                          </button>
                        </Link>

                        <button
                          className="transition-all delay-100 duration-100 hover:bg-red-600 hover:text-white px-7 py-2 rounded-md"
                          onClick={() => {
                            handleLogOut();
                            toast("Logged Out successfully");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <p
              className="text-white cursor-pointer hover:text-green-300"
              onClick={() => setModal(true)}
            >
              Login/Sign up
            </p>
          )}
        </div>
      </div>
      <div
        className="lg:hidden cursor-pointer flex gap-10"
        onClick={() => setMenu(!menu)}
      >
        <Link to={"/cart"} className="relative">
          <FaShoppingCart className="text-white text-xl cursor-pointer " />
          <span className="absolute -top-2 left-4 w-[15px] h-[15px] bg-red-600 text-white rounded-full flex items-center justify-center p-2 text-sm">
            {Cart.length}
          </span>
        </Link>
        {menu ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaBars className="text-white text-xl" />
        )}
      </div>
    </nav>
  );
};

export default Nav;
