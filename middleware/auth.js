const Event = require("../models/event");

// middleware to check if user is a guest
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    // if user is not logged in
    return next();
  } else {
    // middleware to if user is logged in
    req.flash("error", "You are logged in already.");
    return res.redirect("/users/profile");
  }
};

// middleware to check if user is authenticate
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    req.flash("error", "You need to login first.");
    return res.redirect("/users/login");
  }
};

// middleware to check if user is host/author of the event
exports.ishost = (req, res, next) => {
  let id = req.params.id;
  Event.findById(id)
    .then((event) => {
      if (event) {
        if (event.host == req.session.user) {
          return next();
        } else {
          let err = new Error(
            " You are unauthorized to access these resources."
          );
          err.status = 401;
          return next(err);
        }
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};
