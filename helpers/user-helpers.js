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
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          //console.log(status);
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
  addToCart: (proId, userId) => {
    let proObj = {
      item: new ObjectId(proId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (userCart) {
        let proExist = userCart.product.findIndex(
          (product) => product.item == proId
        );
        console.log(proId);
        console.log(proExist);
        if (proExist != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: new ObjectId(userId),
                "product.item": new ObjectId(proId),
              },
              {
                $inc: { "product.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: new ObjectId(userId) },
              {
                $push: { product: proObj },
              }
            )
            .then((response) => {
              resolve();
            });
        }
      } else {
        let cartobj = {
          user: new ObjectId(userId),
          product: [proObj],
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
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      //console.log(cartItems);
      resolve(cartItems);
    });
  },
  getCartCount: (userid) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: new ObjectId(userid) });
      if (cart) {
        count = cart.product.length;
      }
      resolve(count);
    });
  },
  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);
    return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              _id: new ObjectId(details.cart),
            },
            {
              $pull: { product: { item: new ObjectId(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      }

      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            _id: new ObjectId(details.cart),
            "product.item": new ObjectId(details.product),
          },
          {
            $inc: { "product.$.quantity": details.count },
          }
        )
        .then((response) => {
          resolve({status:true});
        });
    });
  },
  removeCart: (details) => {
    return new Promise((resolve) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            _id: new ObjectId(details.cart),
          },
          {
            $pull: { product: { item: new ObjectId(details.product) } },
          }
        )
        .then(() => {
          resolve({ removeCartProduct: true });
        });
    });
  },

  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}
            }
          }
        ])
        .toArray();
      resolve(total[0].total);
    });
  },
  placeOrder:(order,product,total)=>{
    return new Promise((resolve,reject)=>{
      console.log('*****');
      console.log(order,product,total);
      console.log('*****');
      let status=order['Payment-Method']==='COD'?'palced':'penting'
      let orderObj={
        deliveryDetails:{
        mobile:order.mobile,
        address:order.address,
        pincode:order.pincode,
      },
      userid:new ObjectId (order.userid),
      paymentMethod:order['Payment-Method'],
      product:product,
      totalAmount:total,
      status:status,
      date: new Date()
    }
    db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
/*       db.get().collection(collection.CART_COLLECTION).removeOne({user:new ObjectId(order.userid)})
 */      resolve()
    })

    })

  },
  getCartProductList:(user)=>{
    return new Promise(async (resolve,reject)=>{
      let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user: new ObjectId(user)})
      resolve(cart.product)

    })
  }
};
