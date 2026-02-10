import mongoose from 'mongoose';

const trackingEntrySchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Habit name cannot exceed 100 characters']
  },
  icon: {
    type: String,
    default: '📝',
    maxlength: [10, 'Icon/label cannot exceed 10 characters']
  },
  tracking: [trackingEntrySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
habitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Habit', habitSchema);
