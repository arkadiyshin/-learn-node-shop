const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, id, cart) {
    this.username = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db.collection('users').updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('users').insertOne(this);
    }

    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log('err')
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      //console.log(cp.productId, product._id)
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      })
    }

    const updatedCart = {
      items: updatedCartItems
    }

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      ).
      then(result => {
        console.log('add to cart');
        //res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb()
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log('err')
      });
  }
}

module.exports = User;
