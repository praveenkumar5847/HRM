module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    req.flash("ERROR_MESSAGE", "You are not authenticated user");
    res.redirect("/auth/login", 302, {});
  },
};
