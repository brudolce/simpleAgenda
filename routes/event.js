require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');

const routes = express.Router();
const ensureLogin = require('connect-ensure-login');
const ServiceModel = require('../models/Service');
const EventModel = require('../models/Event');


function convertDate() {
  const dateArr = new Date().toDateString().split(' ');
  let month = '';

  switch (dateArr[1]) {
    case 'Jan':
      month = 'January'
      break;
    case 'Feb':
      month = 'February'
      break;
    case 'Mar':
      month = 'March'
      break;
    case 'Apr':
      month = 'April'
      break;
    case 'May':
      month = 'May'
      break;
    case 'Jun':
      month = 'June'
      break;
    case 'Jul':
      month = 'July'
      break;
    case 'Aug':
      month = 'August'
      break;
    case 'Sep':
      month = 'September'
      break;
    case 'Sep':
      month = 'September'
      break;
    case 'Oct':
      month = 'October'
      break;
    case 'November':
      month = 'Nov'
      break;
    case 'Dec':
      month = 'December'
      break;
  }
  return `${dateArr[2]} ${month}, ${dateArr[3]}`;
}

// Open Home and List All Events
routes.get('/home', ensureLogin.ensureLoggedIn(), (req, res) => {
  EventModel.find({ $and: [{ userId: req.user._id }, { day: convertDate() }] })
    .then((events) => {
      ServiceModel.find({ userId: req.user._id })
        .then((services) => {
          console.log({ services, events });
          res.render('home', { services, events, user: req.user });
        })
        .catch(() => {
          res.redirect('/login');
        });
    })
    .catch(() => {
      res.redirect('/login');
    });
});

routes.post('/home', ensureLogin.ensureLoggedIn(), (req, res) => {
  const { date } = req.body;

  EventModel.find({ $and: [{ userId: req.user._id }, { day: date }] })
    .then((events) => {
      ServiceModel.find({ userId: req.user._id })
        .then((services) => {
          console.log({ services, events });
          res.render('home', { services, events, user: req.user });
        })
        .catch(() => {
          res.redirect('/login');
        });
    })
    .catch(() => {
      res.redirect('/login');
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
      res.redirect('/home');
    })
    .catch(() => {
      res.redirect('/home');
    });
});


// Delete One Event
routes.get('/home/event/del/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/home');
    })
    .catch((err) => {
      console.log(`Error on deleting event: ${err}`);
      res.redirect('/home');
    });
});

// Edit Event
routes.post('/home/event/edit', ensureLogin.ensureLoggedIn(), (req, res) => {
  const { nameService, nameClient, emailClient, day, hour, id } = req.body;

  EventModel.update({ _id: id }, { nameService, nameClient, emailClient, day, hour })
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
