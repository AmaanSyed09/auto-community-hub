const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RsvpSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is requried."],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is requried."],
    },
    status: {
      type: String,
      required: [true, "Status is requried."],
      enum: ["YES", "NO", "MAYBE"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rsvp", RsvpSchema);
