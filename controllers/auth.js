const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  req.session.isLoggedIn = false;

  User.findOne({ email })
    .then(user => {
      if (user.password === password) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(result => {
          res.redirect('/');
        })
      } else {
        console.log('incorrect password')
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
};