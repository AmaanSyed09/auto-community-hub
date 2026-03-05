const { body, validationResult } = require("express-validator");

// Validation and sanitization for event fields
exports.validateEvent = [
  body("category", "Category is required")
    .notEmpty()
    .isIn([
      "Car Race",
      "Car Shows",
      "Car Community Events",
      "Car Meet Up",
      "Car Rally",
      "Car Unveiling",
    ])
    .trim()
    .escape(),
  body("title", "Title is required").notEmpty().trim().escape(),
  // body("image", "Image is required").notEmpty().trim().escape(), gives issue while updating event
  body("details", "Details must be at least 10 characters long")
    .isLength({ min: 10 })
    .trim()
    .escape(),
  body("location", "Location is required").notEmpty().trim().escape(),

  body("startDate", "Start date is required and must be a valid date")
    .notEmpty()
    .isISO8601()
    .toDate(),
  body("endDate", "End date is required and must be a valid date")
    .notEmpty()
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate;
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error("End date cannot be earlier than start date.");
      }
      return true;
    }),
];

// Middleware to check validation results
exports.validateEventResult = (req, res, next) => {
  const errors = validationResult(req); // Check for validation errors
  if (!errors.isEmpty()) {
    // If errors are present, add them to flash and redirect back
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("back");
  } else {
    next(); // No validation errors, proceed to the next middleware
  }
};
