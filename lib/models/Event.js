import mongoose, { Schema, Document } from 'mongoose';

const EventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
  },
  start: {
    type: Date,
    required: [true, 'Please provide a start date and time']
  },
  end: {
    type: Date,
    required: [true, 'Please provide an end date and time']
  },
  color: {
    type: String,
    default: 'blue',
    enum: ['blue', 'red', 'green', 'yellow', 'purple', 'orange']
  },
  organizer: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure end date is after start date
EventSchema.pre('save', function(next) {
  if (this.end < this.start) {
    next(new Error('End date must be after start date'));
  }
  next();
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);