//callback from model folder
const { DateTime } = require("luxon");
const model = require("../models/event"); //using event.js model
const rsvpModel = require("../models/rsvp.js"); //using rsvp.js model

//callback funtion for routes in routes/eventRoutes.js

//1. GET /events: send all events and unique categories to user
exports.index = (req, res, next) => {
  // Fetch all unique categories
  model
    .distinct("category")
    .then((categories) => {
      // Fetch all events
      model
        .find()
        .then((events) => {
          // Render the index view with events and unique categories
          res.render("./event/index", { events, categories });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

//2.GET /events/new:send form to create new event
exports.new = (req, res) => {
  res.render("./event/new"); //render new.ejs file
};

//3.POST /events: create new event
exports.create = (req, res, next) => {
  let event = new model(req.body); //create a new event document
  req.flash("success", "Event Created susccessfully"); //flash message
  event.host = req.session.user; //add host id to event object
  if (req.file) {
    event.image = "/images/" + req.file.filename; //add image path to event object
  }
  event
    .save() //save the document to the database
    .then((event) => res.redirect("/events"))

    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

// 4. GET /events/:id: send details of event with id
exports.show = (req, res, next) => {
  let id = req.params.id;
  //id is 24 bit hex string
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id " + id);
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    .populate("host", "firstName lastName")
    .lean()
    .then((event) => {
      if (event) {
        rsvpModel
          .find({ event: id, status: "YES" }) //find all rsvp objects with event id and status YES
          .lean()
          .then((rsvps) => {
            console.log(rsvps);
            event.rsvps = rsvps.length;

            rsvpModel
              .find({ event: id }) //find all rsvp objects with event id
              .populate("user", "firstName lastName")
              .lean()
              .then((rsvpList) => {
                console.log(rsvpList);
                res.render("./event/show", { event, rsvp: rsvpList });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//5.Get /events/:id/edit:send form to edit event with id
exports.edit = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id " + id);
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    .then((event) => {
      if (event) {
        const newEvent = {
          ...event._doc,

          startDate: DateTime.fromJSDate(event.startDate).toISO().slice(0, 16),
          endDate: DateTime.fromJSDate(event.endDate).toISO().slice(0, 16),
        };
        console.log(newEvent); //console log the event object
        return res.render("./event/edit", { event: newEvent });
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//6.PUT /eventss/:id: update event with id
exports.update = (req, res, next) => {
  let event = req.body;
  let id = req.params.id;
  req.flash("success", "Event updated susccessfully");

  model
    .findByIdAndUpdate(id, event, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((event) => res.redirect("/events/" + id))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//7.DELETE /events/:id: delete event with id
exports.delete = (req, res, next) => {
  let id = req.params.id;
  req.flash("success", "Event deleted successfully");

  model
    .findByIdAndDelete(id, { useFindAndModify: false })
    .then((event) => {
      return rsvpModel.deleteMany({ event: id }); // Delete all RSVPs associated with the event
    })
    .then(() => {
      req.flash("success", "Event and associated RSVPs deleted successfully");
      res.redirect("/events");
    })
    .catch((err) => next(err));
};

//8. RSVP /events/:id/rsvp: handle RSVP functionality
// exports.rsvpEvent = (req, res, next) => {
//   console.log(req.body, "testing yfgygefuygaeuygfye");

//   // let eventId = req.params.id;
//   // let userId = req.session.user;
//   // let status = req.params.status;

//   // model
//   //   .findById(eventId)
//   //   .lean()
//   //   .then((event) => {
//   //     if (event.host == userId) {
//   //       let err = new Error("You cannot RSVP to your own event");
//   //       err.status = 400;
//   //       return next(err);
//   //     }
//   //     rsvpModel
//   //       .findOne({ event: eventId, user: userId }) //find the rsvp object with event id and user id
//   //       .lean()
//   //       .then((existingRsvp) => {
//   //         //if rsvp object exists then update the status
//   //         if (existingRsvp) {
//   //           rsvpModel
//   //             .findOneAndUpdate(
//   //               { event: eventId, user: userId },
//   //               { status: status },
//   //               { useFindAndModify: false }
//   //             )
//   //             .then(() => {
//   //               //redirect to the event page with the updated rsvp status
//   //               req.flash("success", "RSVP updated successfully");
//   //               res.redirect("/users/profile/");
//   //             })
//   //             .catch((err) => next(err));
//   //         } else {
//   //           //if rsvp object does not exist then create a new rsvp object
//   //           const newRsvp = new rsvpModel({
//   //             user: userId,
//   //             event: eventId,
//   //             status: status,
//   //           });
//   //           newRsvp //save the rsvp object to the database and redirect to the event page
//   //             .save()
//   //             .then(() => {
//   //               req.flash("success", "RSVP created successfully");
//   //               res.redirect("/users/profile/");
//   //             })
//   //             .catch((err) => {
//   //               if (err.name === "ValidationError") {
//   //                 err.status = 400;
//   //               }
//   //               next(err);
//   //             });
//   //         }
//   //       })
//   //       .catch((err) => next(err));
//   //   })
//   //   .catch((err) => next(err));
// };
exports.rsvpEvent = (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.session.user;

  // Ensure the event exists
  model
    .findById(eventId)
    .then((event) => {
      if (!event) {
        const err = new Error("Event not found");
        err.status = 404;
        return next(err);
      }

      // Prevent the host from RSVPing to their own event
      if (event.host.toString() === userId) {
        const err = new Error("You cannot RSVP to your own event");
        err.status = 401;
        return next(err);
      }

      // Process RSVP
      rsvpModel
        .findOneAndUpdate(
          { event: eventId, user: userId },
          { status: req.body.rsvp },
          { upsert: true, new: true, runValidators: true }
        )
        .then(() => {
          req.flash("success", "RSVP updated successfully");
          res.redirect("/events/" + eventId);
        })
        .catch(next);
    })
    .catch(next);
};
