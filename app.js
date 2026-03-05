// require modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodoverride = require("method-override");
const eventRoutes = require("./routes/eventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");
const user = require("./models/user");
const { getCollection } = require("./models/event");

//create application
const app = express();

//configure application
let port = 3000;
let host = "localhost";
// let url = "mongodb://localhost:27017";
app.set("view engine", "ejs");
const mongUri =
  "mongodb+srv://admin:Amaan123@cluster0.iaek5.mongodb.net/car_community";

// mongodb+srv://admin:Amaan123@cluster0.iaek5.mongodb.net/car_community
//connect to MongoDB server
mongoose
  .connect(mongUri)
  .then((client) => {
    app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  })
  .catch((err) => console.log(err.message));

//mount middlewares

app.use(
  session({
    secret: "ajfeirf90aeu9eroejfoefj",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://admin:Amaan123@cluster0.iaek5.mongodb.net/car_community",
    }),
    cookie: { maxAge: 60 * 60 * 1000 },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

app.use((req, res, next) => {
  let id = req.session.user;
  if (id) {
    Promise.all([user.findById(id)])
      .then((results) => {
        const [user] = results;
        res.locals.userDetails = user;
        next();
      })
      .catch((err) => next(err));
  } else {
    res.locals.userDetails = { firstName: "" };
    next();
  }
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodoverride("_method"));
app.use("/", mainRoutes); //mount mainRoutes
app.use("/events", eventRoutes); //mount eventRoutes
app.use("/users", userRoutes); //mount userRoutes

// error handling middleware for 404 errors
app.use((req, res, next) => {
  let err = new Error(" The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

// error handling middleware for 500 errors
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
