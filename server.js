const express = require("express");
const { PORT, MONGODB_URL } = require("./config");
const Handlebars = require("handlebars");
//create top level function
const app = express();
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const { connect } = require("mongoose");
const { engine } = require("express-handlebars");
const passport = require("passport");
require("./middlewares/passport")(passport);

//importing all routing module
const EmployeeRoute = require("./Route/employee");
const AuthRoute = require("./Route/auth");
const { join } = require("path");
//!======================database connection STARTS here===============
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("database connected");
};
DatabaseConnection();
//!======================database connection ENDS here===============
//?=================to do template engine middleare STARTS here==================
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//?=================to do template engine middleare ENDS here==================
//*=================BUILT in middlewares STARTS Here====================
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//*=================BUILT in middlewares ENDS Here====================

//session and flash middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// handlebars helper class
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

//set global variables
app.use(function (req, res, next) {
  app.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  app.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user=req.user||null
  let userDate=req.user||null
  res.locals.finalData=Object.create(userDate);
  res.locals.username=res.locals.finalData.username;
  next();
});

//route setting for employees
app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);
//listen a port
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`HRM app is running on port number ${PORT}`);
});
