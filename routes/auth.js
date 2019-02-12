const express = require('express');

const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const User = require('../models/User');

// SIGNUP
authRoutes.get('/signup', (req, res) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup');
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup');
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
          res.render('auth/signup');
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// SIGNIN
authRoutes.get('/signin', (req, res) => {
  res.render('auth/signin');
});

authRoutes.post('/signin', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true,
  passReqToCallback: true
}));


module.exports = authRoutes;
