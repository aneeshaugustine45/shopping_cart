const promise = require("promise");
var db = require("../config/connection");
var collection = require("../config/collections");
const { resolve } = require("promise");
const { response } = require("../app");
var objectId=require('mongodb').objectId

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data.insertedId);
      });
  },
  getAllProducts: () => {
    return new promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProduct: (proId) => {
    return new promise((resolve, reject) => {
      db.get
        .collection(collection.PRODUCT_COLLECTION)
        .removeOne({ _id:objectId(proId)})
        .then((response) => {
          //console.log(response);
          resolve(response);
        });
    });
  },
};
