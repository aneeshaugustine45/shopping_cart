var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
//const {bcrypt} = require('bcryptjs');
const { resolve, reject } = require("promise");

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
      //console.log(userData);
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      //console.log(user);
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          console.log(status);
          if (status) {
            console.log("login succes");
            response.user=user
            response.status=true
            resolve(response)
          } else {
            console.log("login failed incurrect pasword");
            resolve({status:false})
          }
        });
      } else {
        console.log("login failed");
        resolve({status:false})

      }
    });
  },
};
