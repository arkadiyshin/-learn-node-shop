const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(result => {
      console.log(result)
      // TODO: check password
      res.redirect('/');

    })
    .catch(err => {
      console.log(err);
    });
};