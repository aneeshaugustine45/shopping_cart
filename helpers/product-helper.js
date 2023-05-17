const promise = require("promise");
var db =require("../config/connection");
var collection = require('../config/collections')
const { resolve } = require("promise");

module.exports = {
    addProduct:(product, callback)=>{
        db.get().collection("product").insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new promise(async(resolve,reject)=>{
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    }

}