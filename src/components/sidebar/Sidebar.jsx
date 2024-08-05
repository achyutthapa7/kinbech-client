import React, { useEffect } from "react";
import { useUser } from "../../context/User";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = ({ menu, setMenu = () => {}, setModal = () => {} }) => {
  const [userInfo, setUserInfo] = useUser();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setUserInfo({ ...userInfo, userDetails: null, token: "" });
    toast("Logged Out successfully");
    setMenu(false);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setUserInfo({ ...userInfo, mode: selectedMode });
    closeMenu();
    toast(`Switched to ${selectedMode}`);
    if (selectedMode === "Selling") {
      navigate("/dashboard/addproduct");
    }
  };

  useEffect(() => {
    const closeMenu = () => {
      setMenu(false);
    };

    window.addEventListener("scroll", closeMenu);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("scroll", closeMenu);
      window.removeEventListener("resize", closeMenu);
    };
  }, [setMenu]);

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
    <div
      className={`z-50 transition-transform delay-75 duration-150 h-screen w-[270px] shadow-2xl fixed top-0 bg-white rounded-md ${
        menu ? "" : "-translate-x-full"
      }`}
    >
      <div className="p-5 flex flex-col items-center">
        {userInfo.userDetails && userInfo.token ? (
          <>
            <div className="w-[60px] h-[60px] rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl mb-4">
              {userInfo.userDetails.userName[0]?.toUpperCase()}
            </div>
            <p className="text-lg font-medium mb-6">
              {userInfo.userDetails.userName}
            </p>
            <div className="w-full mb-6">
              <label
                htmlFor="mode"
                className="block text-sm font-medium text-gray-700"
              >
                Mode
              </label>
              <select
                id="mode"
                name="mode"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={userInfo.mode}
                onChange={handleModeChange}
              >
                <option value="Buying">Buying</option>
                <option value="Selling">Selling</option>
              </select>
            </div>
            <div className="mb-6">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  userInfo.mode === "Selling" ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {userInfo.mode}
              </span>
            </div>
            <Link
              to={"/settings/updateusername"}
              className="mb-4 w-full"
              onClick={closeMenu}
            >
              <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
                Change Username
              </button>
            </Link>
            <Link
              to={"/settings/updatepassword"}
              className="mb-4 w-full"
              onClick={closeMenu}
            >
              <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
                Update Password
              </button>
            </Link>
            <Link
              className="mb-4 w-full"
              onClick={() => {
                closeMenu();
                handleForgetPassword();
              }}
            >
              <button className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
                forget Password
              </button>
            </Link>
            {userInfo.mode === "Selling" && (
              <>
                <Link
                  to={"/dashboard/addproduct"}
                  className="mb-4 w-full"
                  onClick={closeMenu}
                >
                  <button className="transition-all delay-100 duration-100 hover:bg-green-600 hover:text-white px-7 py-2 rounded-md w-full text-left">
                    Add Product
                  </button>
                </Link>
                <Link
                  to={"/dashboard/allproduct"}
                  className="mb-4 w-full"
                  onClick={closeMenu}
                >
                  <button className="transition-all delay-100 duration-100 hover:bg-green-600 hover:text-white px-7 py-2 rounded-md w-full text-left">
                    View All Products
                  </button>
                </Link>
              </>
            )}
            <button
              className="transition-all delay-100 duration-100 hover:bg-red-600 hover:text-white px-7 py-2 rounded-md w-full text-left"
              onClick={() => {
                handleLogOut();
                closeMenu();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium mb-6">Please log in</p>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 transition-all delay-100 duration-100 px-7 py-2 rounded-md mb-4"
              onClick={() => {
                setModal(true);
                closeMenu();
              }}
            >
              Login/Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
