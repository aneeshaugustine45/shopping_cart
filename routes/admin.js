var express = require("express");
var router = express.Router();
var productHelprer = require("../helpers/product-helper");

/* GET users listing. */
router.get("/", function (req, res, next) {
productHelprer.getAllProducts().then((produtcs)=>{
  //console.log(produtcs);
  res.render("admin/view-products", { admin: true, produtcs });
})


});
router.get("/add-product", function (req, res) {
  res.render("admin/add-product");
});

router.post("/add-product", (req, res) => {

  productHelprer.addProduct(req.body, (id) => {

    let image = req.files.image;

    image.mv('./public/product-images/' + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/view-products");
        console.log("image added");
      } else {
        console.log(err);
        res.render(err);
      }
    });
  });
});

module.exports = router;
