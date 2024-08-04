import React, { useState } from "react";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgetPassword = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URL}/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setMessage("Verification code sent to your email.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error sending verification code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Forget Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-64"
      />
      <button
        onClick={handleForgetPassword}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Verification Code
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default Forgetpassword;
