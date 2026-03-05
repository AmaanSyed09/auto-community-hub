const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Car Race",
        "Car Shows",
        "Car Community Events",
        "Car Meet Up",
        "Car Rally",
        "Car Unveiling",
      ],
    },
    title: { type: String, required: [true, "Title is required"] },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    image: { type: String, required: [true, "Image is required"] },
    details: {
      type: String,
      required: [true, "Details are required"],
    },
    location: { type: String, required: [true, "Location is required"] },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("Event", eventSchema);
