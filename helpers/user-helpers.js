var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { resolve, reject } = require("promise");
const { ObjectId } = require("mongodb");
const { response, request } = require("../app");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      //console.log(userData); // data is here
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          // Resolving the promise with the inserted data
          resolve(data); //this is not working
        });
    });
  },
  dologin: (userData) => {
    return new Promise(async (resolve, reject) => {
      console.log(userData);
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      console.log(user);
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          console.log(status);
          if (status) {
            console.log("login succes");
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
  addToCart: (proId, userId) => {
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (userCart) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { user: new ObjectId(userId) },
            {
              $push: { product: new ObjectId(proId) },
            }
          )
          .then((response) => {
            resolve();
          });
      } else {
        let cartobj = {
          user: new ObjectId(userId),
          product: [new ObjectId(proId)],
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartobj)
          .then((response) => {
            resolve();
          });
      }
    });
  },
  getCartProduct: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              let: { prodlist: "$product" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                     $in: ["$_id", "$$prodlist"],
                    },
                  },
                },
              ],
              as: "cartItems",
            },
          },
        ])
        .toArray();
      resolve(cartItems[0].cartItems);
    });
  },
  getCartCount:(userid)=>{
    console.log(userid);
    return new Promise(async (resolve,reject)=>{
      let count =0
      let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userid)})
      if (cart){
        count=cart.product.length
      }
      resolve(count)
    })
  }
};
