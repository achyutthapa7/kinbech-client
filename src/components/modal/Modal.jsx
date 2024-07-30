import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/User";
const Modal = ({ modal, setModal = () => {} }) => {
  const modalRef = useRef();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setModal]);

  return (
    <div
      className={`bg-black h-screen w-full absolute flex items-center justify-center bg-opacity-70 ${
        modal ? "block" : "hidden"
      } z-30 fixed`}
    >
      <div
        className="z-50 bg-white lg:h-3/4 lg:w-1/2 rounded-md md:w-3/4 md:h-3/4 w-[90%] h-3/4 relative top-14 overflow-scroll scrollbar-hide"
        ref={modalRef}
      >
        <span
          className="text-2xl font-medium absolute right-5 top-2 cursor-pointer"
          onClick={() => setModal(false)}
        >
          <FaTimes />
        </span>
        <div className="p-5">
          {isSignUp ? (
            <Registrationform setIsSignUp={setIsSignUp} setModal={setModal} />
          ) : (
            <Loginform setIsSignUp={setIsSignUp} setModal={setModal} />
          )}
        </div>
      </div>
    </div>
  );
};

const Loginform = ({ setIsSignUp, setModal = () => {} }) => {
  const [userInfo, setUserInfo] = useUser();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem("USERS", JSON.stringify(userInfo));
  }, [userInfo]);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const { userName, password } = formData;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    login();
  };
  const login = async () => {
    if (!userName || !password) {
      toast.error("All field are required");
      setIsLoading(false);
    } else {
      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userName,
            password,
          }),
          credentials: "include",
        });

        const data = await res.json();
        if (res.status === 200) {
          setFormData({ userName: "", password: "" });
          setUserInfo({
            ...userInfo,
            userDetails: data.user,
            token: data.token,
            mode: "Buying",
          });
          toast.success(data.message);
          setModal(false);
          navigate("/home");
          setIsLoading(false);
        } else if (res.status === 404) {
          toast.error(data.message);
          setIsLoading(false);
        } else if (res.status === 402) {
          toast.error(data.message);
          setIsLoading(false);
        } else if (res.status === 400) {
          toast.error(data.message);
          setIsLoading(false);
        } else {
          toast.error("Internal server error");
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-5 text-center">Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-3 w-full"
          name="userName"
          value={userName}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      <p
        className="mt-3 text-blue-500 cursor-pointer text-center"
        onClick={() => setIsSignUp(true)}
      >
        Don't have an account? Sign up
      </p>
    </>
  );
};

const Registrationform = ({ setIsSignUp, setModal = () => {} }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    emailAddress: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    emailAddress,
    userName,
    password,
    confirmPassword,
  } = formData;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !emailAddress ||
      !userName ||
      !password ||
      !confirmPassword
    ) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match, please try again");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/registration", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          gender,
          emailAddress,
          userName,
          password,
          confirmPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success("Registration Successfull");
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "Male",
          emailAddress: "",
          userName: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/verification", { state: data.emailAddress });

        setModal(false);
      } else {
        {
          toast.error(data.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-5 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          className="border p-2 mb-3 w-full"
          name="firstName"
          value={firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border p-2 mb-3 w-full"
          name="lastName"
          value={lastName}
          onChange={handleChange}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          className="border p-2 mb-3 w-full"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={handleChange}
        />
        <select
          className="border p-2 mb-3 w-full"
          name="gender"
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 mb-3 w-full"
          name="emailAddress"
          value={emailAddress}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-3 w-full"
          name="userName"
          value={userName}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 mb-3 w-full"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? "loading..." : "Sign up"}
        </button>
      </form>
      <p
        className="mt-3 text-blue-500 cursor-pointer text-center"
        onClick={() => setIsSignUp(false)}
      >
        Already have an account? Log in
      </p>
    </>
  );
};

export default Modal;
