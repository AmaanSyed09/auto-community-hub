const model = require("../models/user");
const event = require("../models/event");
const rsvp = require("../models/rsvp");

//send form to create new user===============================================
exports.new = (req, res) => {
  res.render("./user/new");
};

//create new user document in database===============================================
exports.create = (req, res, next) => {
  let user = new model(req.body);
  user
    .save()
    .then((user) => {
      req.flash("success", "User created successfully");
      res.redirect("/users/login");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has already been used.");
        console.log("Email has already been used.");
        return res.redirect("/users/new");
      }
      next(err);
    });
};

//send form to login===============================================
exports.getUserLogin = (req, res, next) => {
  res.render("./user/login");
};

//authenticate user login===============================================
// exports.login = (req, res, next) => {
//   console.log("Login endpoint hit"); //get email and password from form
//   let email = req.body.email;
//   let password = req.body.password;
//   model
//     .findOne({ email: email })
//     .then((user) => {
//       console.log("User found:", user); //if user is not found, return error message
//       if (!user) {
//         console.log("wrong email address");
//         req.flash("error", "wrong email address");
//         res.redirect("/users/login");
//       } else {
//         user.comparePassword(password).then((result) => {
//           console.log("Password match:", result); // Log password comparison result
//           if (result) {
//             req.session.user = user._id;
//             req.flash("success", "You have successfully logged in");
//             return res.redirect("/users/profile");
//           } else {
//             req.flash("error", "wrong password");
//             console.log("wrong password");
//             return res.redirect("/users/login");
//           }
//         });
//       }
//     })
//     .catch((err) => next(err));
// };

exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");

        console.log("wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            console.log("wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

//send user profile===============================================
exports.profile = (req, res, next) => {
  let id = req.session.user;
  Promise.all([
    model.findById(id),
    event.find({ host: id }),
    rsvp.find({ user: id }).populate("event"),
  ])
    .then((results) => {
      const [user, events, rsvp] = results;
      console.log(rsvp);
      res.render("./user/profile", { user, events, rsvp });
    })
    .catch((err) => next(err));
};

//logout user===============================================
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};
