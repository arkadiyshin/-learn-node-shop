const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
  User.findById('6474b05db22ab4b939c74c9e')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.igv9dig.mongodb.net/shop?retryWrites=true&w=majority`)
  .then(result => {
    User
      .findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'admin',
            email: 'test@test.com',
            cart: {
              items: []
            }
          })
          user.save();
        }
      })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
