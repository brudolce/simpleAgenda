const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
  value: Number,
  userId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  }, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;