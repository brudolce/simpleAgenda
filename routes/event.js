require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');

const routes = express.Router();
const ensureLogin = require('connect-ensure-login');
const ServiceModel = require('../models/Service');
const EventModel = require('../models/Event');

// Open Home and List All Events
routes.get('/home', ensureLogin.ensureLoggedIn(), (req, res) => {

  EventModel.find({ userId: req.user._id })
    .then((events) => {
      ServiceModel.find({ userId: req.user._id })
        .then((services) => {
          console.log({ services, events });
          res.render('home', { services, events });
        })
        .catch(() => {
          res.redirect('/signin');
        });
    })
    .catch(() => {
      res.redirect('/signin');
    });
});


// Create Event
routes.post('/home/add/event', ensureLogin.ensureLoggedIn(), (req, res) => {
  const { nameService, nameClient, emailClient, day, hour } = req.body;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i += 1) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  const newEvent = new EventModel({
    nameService,
    nameClient,
    emailClient,
    day,
    hour,
    confirmationEvent: false,
    confirmationCode,
    userId: req.user._id
  });

  console.log("new Event", newEvent);

  newEvent.save()
    .then(() => {
      console.log('Enviando email');
      if (emailClient !== '') {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });
        transporter.sendMail({
          from: '"Confirmation E-mail',
          to: emailClient,
          subject: 'Confirmation E-mail',
          text: 'Confirm your e-mail, please!',
          html: `<b><a href=http://localhost:3000/event/confirm/${confirmationCode} + >Click here to confirm your email</a></b>`
        });
        console.log('enviando email');
      }
      res.redirect('/home/services');
    })
    .catch(() => {
      res.render('service');
    });
});


// Delete One Event
routes.get('/home/event/del/:id', (req, res) => {
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/home/services');
    })
    .catch((err) => {
      console.log(`Error on deleting event: ${err}`);
      res.redirect('/home');
    });
});

// Edit One Event

// Requisição de EDIÇÃO
routes.post('/home/event/edit', (req, res) => {
  const { nameService, nameClient, emailClient, day, hour } = req.body;

  EventModel.update({ _id: req.query.bookId }, { nameService, nameClient, emailClient, day, hour })
    .then(() => {
      res.redirect('/home');
    })
    .catch((error) => {
      console.log(error);
    });
});

routes.get('/event/confirm/:confirmationCode', (req, res) => {
  const { confirmationCode } = req.params;

  EventModel.findOne({ confirmationCode })
    .then((event) => {
      console.log(event);
      if (event !== null) {
        EventModel.updateOne({ confirmationCode }, { confirmationEvent: true })
          .then(() => {
            console.log('Status of account: Active');
            res.send('Event Confirmed');
          });
        return;
      }
      console.log('code not ok');
      res.render('/');
    });
});


module.exports = routes;
