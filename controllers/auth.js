const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {

  req.session.isLoggedIn = false;
  //res.setHeader('Set-Cookies', '')
  //req.session.isLoggedIn = false;

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(result => {
      console.log(result)
      // TODO: check password
      req.session.isLoggedIn = true;
      res.redirect('/');

    })
    .catch(err => {
      console.log(err);
    });
};