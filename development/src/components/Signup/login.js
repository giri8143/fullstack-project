import axios from "axios";
import React, { useState } from "react";
import "./login.css";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission
    axios
      .post("http://localhost:5000/user/loginuser", formData)
      .then((res) => {
        let statuscode = res.data.statuscode;
        if (statuscode === "200") {
          Swal.fire({
            icon: "success",
            text: "Login success",
          });
          navigate("/dashboard", { state: res.data.user });
        }
        if (statuscode === "400") {
          Swal.fire({
            icon: "error",
            text: "...oops",
            text: "email doesn't exists",
          });
        }
        if (statuscode === "401") {
          Swal.fire({
            icon: "error",
            text: "...oops",
            text: "password doesnt match",
          });
        }
        console.log("Response:", res);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        console.log("errrrrrr", err);
      });
  };
  const handleSignup = (e) => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" onClick={handleLogin}>
          Login
        </button>

        <div className="account-exists">
          Dont have an account,
          <span className="span" onClick={handleSignup}>
            Click here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
