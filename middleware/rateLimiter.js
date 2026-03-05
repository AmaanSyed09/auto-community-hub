const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, //2 minute
  max: 5,
  //   message: "Too many request, try again after 1 minute",
  handler: (req, res, next) => {
    let err = new Error("Too many request, try again after 2 minutes");
    err.status = 429;
    return next(err); //default handler
  },
});
