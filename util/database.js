const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

const mongoConnect = cb => {
  MongoClient
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.igv9dig.mongodb.net/?retryWrites=true&w=majority`)
    .then(result => {
      console.log('connected to db!')
      cb(result);
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = mongoConnect;