const express = require('express');

const routes = express.Router();
const ensureLogin = require('connect-ensure-login');
const Service = require('../models/Service');

// LIST SERVICE
routes.get('/home/services', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user._id, 'userId ');

  Service.find({ userId: req.user._id })
    .then((services) => {
      console.log(services);
      res.render('service', { services });
    })
    .catch(() => {
      res.redirect('/');
    });
});

// Edit Service
routes.post('/home/service/edit', (req, res) => {
  const { name, value, id } = req.body;

  Service.update({ _id: id }, { name, value })
    .then(() => {
      res.redirect('/home/services');
    })
    .catch((error) => {
      console.log(error);
    });
});

// DELETE SERVICE
routes.get('/home/services/del/:id', (req, res) => {
  Service.deleteOne({ _id: req.params.id })
    .then(() => redirect('/home/services'))
    .catch((err) => {
      console.log(`Error on deleting service: ${err}`);
      res.redirect('/home/services');
    });
});

// CREATE SERVICE
routes.post('/home/services', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { name, value } = req.body;

  if (name === '' || value === '') {
    res.render('service');
    return;
  }

  Service.findOne({ name })
    .then((user) => {
      if (user !== null) {
        res.render('service');
        return;
      }

      const newService = new Service({
        name,
        value,
        userId: req.user._id
      });

      newService.save((err) => {
        if (err) {
          res.render('service');
        } else {
          res.redirect('/home/services');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = routes;
