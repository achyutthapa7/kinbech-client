import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Forgetpassword = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const emailAddress = location.state.emailAddress;
  const otp = location.state.verificationCode;

  if (verificationCode != otp) {
    toast.error("Invalid Verification Code. Please try again.");
    return null; // Redirect to login page if verification code is invalid.
  }
  if (verificationCode === otp) {
    navigate("/settings/resetpassword");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-5">
          Email Verification
        </h2>
        <p className="text-center mb-5">
          We've sent a verification code to <strong>{emailAddress}</strong>.
          Please enter the code below to verify your email address.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaKey className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Verification Code"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <button
            disabled={verifying}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {verifying ? "Verifying..." : "verify"}
          </button>
        </form>
        <div className="mt-5 text-center">
          <p>Didn't receive a code?</p>
          <button className="text-blue-500 hover:underline focus:outline-none">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;
