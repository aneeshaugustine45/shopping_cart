var express = require("express");
var router = express.Router();
var productHelprer = require("../helpers/product-helper");
const { helpers, log } = require("handlebars");
const userHelpers = require("../helpers/user-helpers");
const { response } = require("../app");
const { route } = require("./admin");
var ObjectId = require("mongodb").ObjectId;


const varifylogin =(req,res,next)=>{
  if (req.session.loggedIn){
  next()
}else{
  res.redirect('/login')
}
}

/* GET home page. */
router.get("/", function (req, res, next) {
  let user=req.session.user
  console.log(user);

  productHelprer.getAllProducts().then((produtcs) => {
    //console.log(produtcs);
    res.render("user/view-products", {produtcs,user});
  });
});
router.get("/login", (req, res) => {
  if (req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render("user/login",{"loginErr":req.session.loginErr});
    req.session.loginErr=false
  }
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  console.log("singup");
  //console.log(req.body); //undifined
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  });
});

router.post("/login", (req, res) => {
  userHelpers.dologin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="invalid username or password"
      res.redirect('/login')
    }
  })
});
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect("/")
})
router.get('/cart',varifylogin,async (req,res)=>{
  let product=await userHelpers.getCartProduct(req.session.user._id)
  console.log(product);
res.render('user/cart',{product,user:req.session.user})
})
router.get('/add-to-cart/:id',varifylogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })

})


module.exports = router;
