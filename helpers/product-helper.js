const Promise = require("promise");
var db = require("../config/connection");
var collection = require("../config/collections");
const { resolve } = require("promise");
const { response } = require("../app");
const { ServerDescription } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product)
      .then((data) => {
        callback(data.insertedId);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: new ObjectId(proId)})
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: new ObjectId(proId) })
        .then((product) => {
          resolve(product);
        });
    });
  },

  updateProduct: (proId, ProductDetails) => {
    console.log(ProductDetails);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne({ _id:new ObjectId(proId)}, {
          $set:{
            name:ProductDetails.name,
            decription:ProductDetails.decription,
            price:ProductDetails.price,
            catogery:ProductDetails.catogery
          }
        }).then((response)=>{
          resolve()
        })
    });
  },

};
