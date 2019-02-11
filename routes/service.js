const express = require('express');
const routes = express.Router();
const ensureLogin = require("connect-ensure-login");
const Service = require("../models/Service")


//LIST SERVICE
routes.get('/home/services', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user._id, 'userId ');

  Service.find({ userId: req.user._id })
    .then((services) => {
      console.log(services);
      res.render("service", { services });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

//EDIT SERVICE GET

//EDIT SERVICE POST

//DELETE SERVICE
  routes.get('/home/services/del/:id', (req,res) => {
    Service.deleteOne({ _id: req.params.id })
    .then (services => redirect('/home/services'))
    .catch(err => {
      console.log('Error on deleting service: ' + err)
       res.redirect("/home/services");
    });
  })



//CREATE SERVICE
routes.post("/home/services", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const name = req.body.name;
  const value = req.body.value;

  if (name === "" || value === "") {
    res.render("service", { message: "Indicate name and value" });
    return;
  }

  Service.findOne({ name })
    .then(user => {
      if (user !== null) {
        res.render("service", { message: "The service already exists" });
        return;
      }

      const newService = new Service({
        name,
        value,
        userId: req.user._id
      });

      newService.save((err, service) => {
        if (err) {
          res.render("service", { message: "Something went wrong" });
        } else {
          //let serviceUser = req.user.service;
          //serviceUser.push(service._id);
          // User.updateOne({ _id: req.user.id}, { service: serviceUser })
          // .then(user=> console.log('User update service:' + user))
          // .catch(err=> console.log('Error on user.service update:' + err));
          res.redirect("/home/services");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});


module.exports = routes;