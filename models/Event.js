const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  nameService: String,
  nameClient: String,
  emailClient: String,
  day: String,
  hour: String,
  confirmationEvent: Boolean,
  confirmationCode: String,
  userId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
