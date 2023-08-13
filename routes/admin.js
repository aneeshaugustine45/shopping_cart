var express = require("express");
var router = express.Router();
var productHelprer = require("../helpers/product-helper");
const { Admin } = require("mongodb");
const productHelper = require("../helpers/product-helper");
const { response } = require("../app");
const userHelpers = require("../helpers/user-helpers");
const { log } = require("handlebars/runtime");

const varifyAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.render("admin/login", { admin: true });
  }
};

/* GET users listing. */
router.get("/", varifyAdmin, function (req, res, next) {
  productHelprer.getAllProducts().then((produtcs) => {
    //console.log(produtcs);
    res.render("admin/view-products", { admin: true, produtcs });
  });
});
router.get("/add-product", varifyAdmin, function (req, res) {
  res.render("admin/add-product", { admin: true});
});
router.post("/add-product", varifyAdmin, (req, res) => {
  productHelprer.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.redirect("/admin/");
        console.log("product added");
      } else {
        console.log(err);
        res.render(err);
      }
    });
  });
});
router.get("/delete-product/:id", varifyAdmin, (req, res) => {
  let proId = req.params.id;
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect("/admin/");
  });
});
router.get("/edit-product/:id", varifyAdmin, async (req, res) => {
  let product = await productHelper.getProductDetails(req.params.id);
  console.log(product + "products");
  res.render("admin/edit-product", { product });
});
router.post("/update-product/:id", varifyAdmin, (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  console.log(id);
  productHelper.updateProduct(req.params.id, req.body).then(() => {
    res.redirect("/admin");
    console.log(req.body);
    if (req.files.image) {
      console.log(req.files.image);
      let image = req.files.image;
      image.mv("./public/product-images/" + id + ".jpg");
    }
  });
});
router.get("/products", varifyAdmin, function (req, res, next) {
  productHelprer.getAllProducts().then((produtcs) => {
    //console.log(produtcs);
    res.render("admin/view-products", { admin: true, produtcs });
  });
});
router.get("/all-users", varifyAdmin, function (req, res, next) {
  userHelpers.getAllUsers().then((users) => {
    res.render("admin/view-all-users", { admin: true, users });
  });
});

router.get("/all-orders", varifyAdmin, function (req, res, next) {
  productHelprer.getAllOrder().then((order) => {
    //console.log(produtcs);
    res.render("admin/view-all-orders", { admin: true, order });
  });
});


router.get("/login", (req, res) => {
  if (req.session.admin) {
    res.redirect("/");
  } else {
    res.render("admin/login", {
      loginErr: req.session.userLoginErr,
    });
    req.session.userLoginErr = false;
  }
});
router.post("/login", (req, res) => {
  productHelper.adminlogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.user;
      req.session.admin.loggedIn = true;
      res.redirect("/admin");
    } else {
      req.session.LoginErr = "invalid username or password";
      res.redirect("/admin");
    }
  });
});
router.get("/logout", (req, res) => {
  console.log("ad login");
  req.session.admin = null;
  res.redirect("/admin");
});
router.get("/add-details",varifyAdmin,(req,res)=>{
  res.render("admin/add-banner",{ admin: true})
});
router.post("/add-banner",varifyAdmin,(req,res)=>{
  productHelprer.addBanner(req.body, (id) => {
  console.log(req.body);
  let image = req.files.image;
  image.mv("./public/images/" + id + ".jpg", (err, done) => {
    if (!err) {
      res.redirect("/admin/");
      console.log("banner added");
    } else {
      console.log(err);
      res.render(err);
    }
  });
  })
});

module.exports = router;
