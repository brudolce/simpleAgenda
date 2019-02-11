const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: String,
  value: Number,
  userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
