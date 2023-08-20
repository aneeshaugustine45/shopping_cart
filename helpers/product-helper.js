const Promise = require("promise");
var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
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

  addBanner:(banner, callback) => {
    db.get()
      .collection(collection.BANNER_COLLECTION)
      .insertOne(banner)
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
  getAllBanner:() => {
    return new Promise(async (resolve, reject) => {
      let banner = await db
        .get()
        .collection(collection.BANNER_COLLECTION)
        .find()
        .toArray();
      resolve(banner);
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
  adminSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      //console.log(userData); // data is here
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          // Resolving the promise with the inserted data
          resolve(data); //this is not working
        });
    });
  },
  adminlogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("login success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed incurrect pasword");
            resolve({ status: false });
          }
        });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },
  getAllOrder:()=> {
    return new Promise(async (resolve, reject) => {
      let order = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find()
        .toArray();
     // console.log(order);
     // console.log(order[0]);
      resolve(order);
    });
  },
};
