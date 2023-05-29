const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6473a0c2cd245f4699c62001')
    .then(user => {
      req.user = new User(user.name, user.email, user._id, user.cart);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(3000);
// })
mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.igv9dig.mongodb.net/shop?retryWrites=true&w=majority`)
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
