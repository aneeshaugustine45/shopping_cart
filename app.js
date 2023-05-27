var express = require("express");
var path = require("path");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");



var usersRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
var hbs = require("express-handlebars");
var app = express();
var fileUpload = require("express-fileupload");
var db=require('./config/connection')


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
//fixe by anessh
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",

    layoutsDir: __dirname + "/views/layout/",
    parlialsDir: __dirname + "/views/parlials/",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true
    }
  })
);

app.use(fileUpload());

db.connect((err)=>{
  if (err)console.log("database connection error"+err);
  else
  console.log("database connected to port 27777");
})

app.use("/", usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;