const User = require("../models/User");
const JWT = require("jsonwebtoken");
const secretKey = process.env.secretKey;
const createUser = async (req, res) => {
  const { username, password, email, isAdmin } = req.body;
  try {
    let duplicateUser = await User.findOne({ email });
    if (duplicateUser) {
      return res
        .status(200)
        .json({ statuscode: "400", message: "email already in use" });
    }

    const user = new User({ username, password, email, isAdmin });
    await user.save();
    res.status(201).json({
      statuscode: "200",
      message: "user created successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("error", error);
  }
};

const userLogin = async (req, res) => {
  let duplicateUser = await User.find();
  try {
    const { email, password } = req.body;
    const newuser = duplicateUser.find((item) => {
      return item.email === email && item.password === password;
    });
    const newlogin = await User.findOne({ email });
    if (!newlogin) {
      return res
        .status(200)
        .json({ statuscode: "400", message: "email doesn't exist" });
    }
    if (password !== newlogin.password) {
      return res
        .status(200)
        .json({ statuscode: "401", message: "password doesn't match" });
    }
    if (newuser) {
      let AuthToken = JWT.sign(
        {
          email: newuser.email,
          admin: newuser.isAdmin,
        },
        secretKey,
        { expiresIn: "1h" }
      );
      const { name } = newlogin;
      res.status(200).json({
        statuscode: "200",
        user: {
          email: newuser.email,
          isAdmin: newuser.isAdmin,
          name,
          AuthToken,
        },
        message: "login successful",
      });
    } else {
      res
        .status(200)
        .json({ statuscode: "401", message: "Invalid credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};

const getuser = async (req, res) => {
  try {
    const { email } = req.query;
    let user;
    if (email) {
      user = await User.find({
        email: { $regex: email, $options: "i" },
      });
    } else {
      user = await User.find();
    }
    const totalCount = user.length;
    if (totalCount > 0) {
      res.status(200).json({
        statuscode: "200",
        message: "data fetched successfully",
        user,
        totalCount,
      });
    }
    if (totalCount === 0) {
      res
        .status(200)
        .json({ statuscode: "400", message: "No data found", totalCount });
    }
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) throw err;
      res
        .status(200)
        .json({ statuscode: "200", message: "User logged out successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};

module.exports = { createUser, userLogin, getuser, logoutUser };
