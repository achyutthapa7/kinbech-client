import React, { useEffect } from "react";
import { useUser } from "../../context/User";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useUser();

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
              className="text-blue-500 hover:underline hover:text-blue-700"
            >
              Add a product
            </Link>
          </li>
          <li>
            <Link
              to="allproduct"
              className="text-blue-500 hover:underline hover:text-blue-700"
            >
              View all products
            </Link>
          </li>
          <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
            Update username
          </li>
          <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
            Reset Password
          </li>
          <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
            Forget Password
          </li>
          <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
            Logout
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
