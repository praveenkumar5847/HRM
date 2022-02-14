const { Router } = require("express");
const userSchema = require("../Model/Auth");
const router = Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});

router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("SUCCESS_MESSAGE", "Successfully logged Out");
  res.redirect("/auth/login", 302, {});
});

router.post("/register", async (req, res) => {
  let { username, email, password, cnf } = req.body;

  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (!email) {
    errors.push({ text: "email is required" });
  }
  if (!password) {
    errors.push({ text: "password is required" });
  }
  if (password !== cnf) {
    errors.push({ text: "password is not match" });
  }
  if (errors.length > 0) {
    // req.flash("errors", "failed to register");
    res.render("../views/auth/register", {
      errors,
      username,
      email,
      password,
      cnf,
    });
  } else {
    let user = await userSchema.findOne({ email });
    if (user) {
      req.flash("ERROR_MESSAGE", "email already exist enter new one");
      res.redirect("/auth/register", 302, {});
    } else {
      let newUser = new userSchema({
        username,
        email,
        password,
      });

      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          await newUser.save();
          req.flash("SUCCESS_MESSAGE", "SUCCESSFULLY REGISTERED");
          res.redirect("/auth/login", 302, {});
        });
      });
    }
  }
});

/*@HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/login */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/home",
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

module.exports = router;
