var express = require("express");
var router = express.Router();
var productHelprer = require("../helpers/product-helper");
const { helpers, log } = require("handlebars");
const userHelpers = require("../helpers/user-helpers");
const { response } = require("../app");

/* GET home page. */
router.get("/", function (req, res, next) {
  productHelprer.getAllProducts().then((produtcs) => {
    console.log(produtcs);
    res.render("user/view-products", { produtcs });
  });
});
router.get("/login", (req, res) => {
  res.render("user/login");
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup",(req,res) => {
  console.log("singup");
  console.log(req.body); //undifined
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  });
});

module.exports = router;
