const express = require('express');
const User = require("../models/User");
const authRoutes = express.Router();
const passport = require("passport");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


//SIGNUP
authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//SIGNIN
authRoutes.get("/signin", (req, res, next) => {
  res.render("signin");
});

authRoutes.post("/signin", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "signin",
  failureFlash: true,
  passReqToCallback: true
}));




module.exports = authRoutes;