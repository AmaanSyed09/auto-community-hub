const model = require("../models/user");

exports.index = (req, res, next) => {
  let id = req.session.user;
  if (id) {
    Promise.all([model.findById(id)])
      .then((results) => {
        const [user] = results;
        res.render("index.ejs", { user });
      })
      .catch((err) => next(err));
  } else {
    res.render("index.ejs");
  }
};

exports.about = (req, res) => {
  res.render("main/about.ejs");
};
exports.contact = (req, res) => {
  res.render("main/contact.ejs");
};
