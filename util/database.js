const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

let _db;

const mongoConnect = callback => {
  MongoClient
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.igv9dig.mongodb.net/?retryWrites=true&w=majority`)
    .then(client => {
      console.log('connected to db!')
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err)
      throw err;
    })
}

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw 'no database found';
  }
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
