const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  const [message] = req.flash('error');
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  req.session.isLoggedIn = false;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save(result => {
              res.redirect('/');
            })
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login')
        })

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

exports.getSignUp = (req, res, next) => {
  const [message] = req.flash('error');
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage: message
  });
}

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confimPassword = req.body.confimPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail exists already. Please pick a different one.');
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save();
        })
        .then(_ => {
          res.redirect('/login')
          return transporter.sendMail({
            to: email,
            from: "noreplay.remondis@gmail.com",
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          })
        })
        .catch(err => console.log(err));;
    })
    .catch(err => console.log(err))
}

exports.getReset = (req, res, next) => {
  const [message] = req.flash('error');
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User
      .findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        return user.save();
      })
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to: email,
          from: "noreplay.remondis@gmail.com",
          subject: 'Password reset!',
          html: `
          <p>You request a password reset</p>
          <p>Clik this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `
        })
      })
      .catch(err => console.log(err))
  })
}