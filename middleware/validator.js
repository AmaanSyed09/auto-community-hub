const mongoose = require("mongoose");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");

//check if id is a valid 24 bit hex string
exports.validateId = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error(`Invalid event id: ${id}`);
    err.status = 400;
    return next(err);
  } else {
    return next();
  }
};

exports.validateSignup = [
  body("firstName", "First name cannot be empty").notEmpty().trim().escape(),
  body("lastName", "Last name cannot be empty").notEmpty().trim().escape(),
  body("email", "Email address is not valid !")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 and at most 64 characters long.",
  ).isLength({
    min: 6,
    max: 64,
  }),
];

exports.validateLogin = [
  body("email", "Email address is invalid !")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 and at most 64 characters long.",
  ).isLength({
    min: 6,
    max: 64,
  }),
];

// Middleware to validate RSVP input
exports.validateRsvp = [
  // Trim and escape the status field
  body("rsvp", "RSVP cannot be empty").notEmpty().trim().escape(),

  // Check that RSVP is only "YES", "NO", or "MAYBE"
  body("rsvp", "RSVP can only be YES, NO, or MAYBE").isIn([
    "YES",
    "NO",
    "MAYBE",
  ]),

  // Validate results
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      req.flash("error", errorMessages.join(", "));
      return res.redirect(`/events/${req.params.id}`); // Send user back to event page
    }
    next();
  },
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req); // Finds validation errors
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error", errorMessages.join(", "));
    return res.redirect(req.originalUrl); // Redirect to the current route with error flash
  }
  next();
};
