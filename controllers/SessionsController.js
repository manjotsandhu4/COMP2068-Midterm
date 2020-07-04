const User = require('../models/user');
const passport = require('passport');
const viewPath = 'sessions';

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'Login'
  });
};

exports.create = (req, res, next) => {
  //  authentication logic 
  passport.authenticate('local', {
    successRedirect: '/reservations',
    successFlash: 'Congrats!! Your Login was Successfull',
    failureRedirect: '/login',
    failureFlash: 'Login Unsuccessfull, Please check your credentials and try again!!'
  })(req, res, next);
};

exports.delete = (req, res) => {
  req.logout();
  req.flash('success', 'You were logged out successfully.');
  res.redirect('/');
};