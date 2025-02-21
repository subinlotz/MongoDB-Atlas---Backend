const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const signup = require("./models/signupModel")
require("dotenv").config();


const PORT = process.env.PORT || 3000;

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

  //route
  app.post("/register", async (req,res)=>{
    try {
      const {name, email, password} = req.body
      const existingUser = await signup.findOne({email});

      if (existingUser) {
        return res.status(400).json({ status: "error", error: "Email already exists" });
      } else {
        const newUser = await signup.create({name, email, password});
        res.status(201).json({ status: "ok", user: newUser });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", error: "Server error" });
    }
  })

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
