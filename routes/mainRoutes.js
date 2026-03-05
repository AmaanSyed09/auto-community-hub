const express = require("express");
const router = express.Router();

// Make sure to import the correct controller
const mainController = require("../controllers/mainController");

// Use the correct controller reference for About and Contact

//send home page
router.get("/", mainController.index);
router.get("/about", mainController.about);
router.get("/contact", mainController.contact);

module.exports = router;
