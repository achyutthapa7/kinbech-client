import React, { useEffect } from "react";
import { useUser } from "../../context/User";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useUser();
  const handleLogOut = () => {
    setUserInfo({ ...userInfo, userDetails: null, token: "" });
  };
  useEffect(() => {
    if (userInfo.mode === "Buying") {
      navigate("/");
    }
    if (!userInfo.userDetails || !userInfo.token) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex gap-5 p-6">
      {/* Sidebar */}
      <div className="bg-white shadow-lg w-72 p-4 rounded-md lg:block hidden">
        <p className="text-2xl font-semibold text-center mb-6">Dashboard</p>
        <ul className="space-y-4">
          <li>
            <Link
              to="addproduct"
              className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left"
            >
              Add a product
            </Link>
          </li>
          <li>
            <Link
              to="allproduct"
              className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left"
            >
              View all products
            </Link>
          </li>
          <li className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
            <Link to={"/settings/updateusername"} className="mb-4 w-full">
              Change Username
            </Link>{" "}
          </li>
          <li className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
            <Link to={"/settings/updatepassword"} className="mb-4 w-full">
              Update Password
            </Link>
          </li>
          <li className="hover:text-blue-600 hover:underline-offset-1 hover:underline w-full text-left">
            <Link to={"/settings/resetpassword"} className="mb-4 w-full">
              Reset Password
            </Link>{" "}
          </li>
          <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
            <button
              className="transition-all delay-100 duration-100 hover:bg-red-600 hover:text-white px-7 py-2 rounded-md"
              onClick={() => {
                handleLogOut();
                toast("Logged Out successfully");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-4 rounded-md">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
