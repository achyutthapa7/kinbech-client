import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa";
import toast from "react-hot-toast";

const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailAddress = location.state;
  useEffect(() => {
    if (!emailAddress) {
      navigate("/");
    }
  }, [navigate, emailAddress]);

  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setVerifying(true);
    verifyCode();
  };
  const verifyCode = async () => {
    if (!verificationCode) {
      toast("Enter verification code first");
      setVerifying(false);
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_PRODUCTION_URL}/verification`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ verificationCode }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
        navigate("/");
        setVerifying(false);
      } else if (res.status === 401) {
        toast.error(data.message);
        setVerifying(false);
      } else if (res.status === 403) {
        toast.error(data.message);
        setVerifying(false);
      } else if (res.status === 404) {
        toast.error(data.message);
        setVerifying(false);
      } else if (res.status === 201) {
        toast.error(data.message);
        setVerifying(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  };

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

export default Verification;
