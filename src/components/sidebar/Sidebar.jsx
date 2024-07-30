import React from "react";

const Sidebar = ({ menu }) => {
  return (
    <div
      className={`transition-transform delay-75 duration-150 
         h-screen w-[270px] shadow-2xl fixed top-0 bg-white rounded-md ${
           menu ? "" : "-translate-x-full"
         }`}
    >
      Dashboard
    </div>
  );
};

export default Sidebar;
