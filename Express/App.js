const express = require("express");
const PORT = 5000;
const mongoClient = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const studentRoutes = require("./routes/StudentRoutes");
const userRoutes = require("./routes/UserRoutes");

const store = new MongoDBStore({
  uri: process.env.URL,
  collection: "mysessions",
});

app.use(
  session({
    secret: "this is a secret key",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route for React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

mongoClient
  .connect(process.env.URL)
  .then(() => {
    console.log("MongoDB Connected successfully");
  })
  .catch((err) => {
    console.log("errr", err);
  });

app.use("/student", studentRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`server started running at ${PORT}`);
});
