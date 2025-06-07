import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    let payload = formData;
    axios
      .post("http://localhost:5000/user/createuser", payload)
      .then((res) => {
        let statusCode = res.data.statuscode;
        if (statusCode === "200") {
          Swal.fire({
            icon: "success",
            text: "user created succesfully",
          });
          navigate("/login");
        }
        if (statusCode === "400") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "email already in use",
          });
        }
        console.log("ressssss", res);
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
  const handleLogin = (e) => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-form ">
        <h2>Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleChange}
          //   required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          //   required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          //   required
        />
        <div className="account-exists">
          Already have an account,
          <span className="span" onClick={handleLogin}>
            Click here
          </span>
        </div>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signup;
