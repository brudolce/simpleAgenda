const express = require('express');
const routes = express.Router();
const ensureLogin = require("connect-ensure-login");
const Service = require("../models/Service")

//Home
routes.get("/home", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("home", { user: req.user });
});



module.exports = routes;