const express = require("express");
const router = express.Router();
const controllers = require("../controllers/eventController");
const { fileUpload } = require("../middleware/fileUpload"); //importing fileUpload middleware
const { isLoggedIn, ishost } = require("../middleware/auth");
const { validateId, validateRsvp } = require("../middleware/validator");
const {
  validateEvent,
  validateEventResult,
} = require("../middleware/eventValidator");

// Create routes

// 1. GET /stories: Send all events to user
router.get("/", controllers.index); // Calling the index controller

// 2. GET /stories/new: Send form to create new event
router.get("/new", isLoggedIn, controllers.new); // Calling the new controller

// 3. GET /stories/:id: Send details of event with id
router.get("/:id", validateId, controllers.show); // Calling the show controller

// 4. GET /stories/:id/edit: Send form to edit event with id
router.get("/:id/edit", isLoggedIn, ishost, validateId, controllers.edit); // Calling the edit controller

// 5. POST /stories: Create new event
router.post(
  "/",
  fileUpload,
  isLoggedIn,
  validateEvent,
  validateEventResult,
  controllers.create
); // Using fileUpload middleware for file handling

// 6. PUT /stories/:id: Update event with id (fixed route)
router.put(
  "/:id",
  fileUpload,
  isLoggedIn,
  ishost,
  validateId,
  validateEvent,
  validateEventResult,
  controllers.update
); // Calling the update controller with fileUpload middleware

// 7. DELETE /stories/:id: Delete event with id
router.delete("/:id", isLoggedIn, ishost, controllers.delete); // Calling the delete controller

// 8. POST /stories/:id/:status: RSVP to event with id
// router.post("/rsvp/:id", controllers.rsvpEvent);
router.post(
  "/rsvp/:id",
  isLoggedIn,
  validateId,
  validateRsvp,
  controllers.rsvpEvent
);

// Export router
module.exports = router;
