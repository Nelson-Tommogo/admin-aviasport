import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  result: { type: String },
  multiplier: { type: Number, required: true },
  players: { type: Number, default: 0 },
  flightPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'FlightPlan' },
}, { timestamps: true });

export default mongoose.model('Flight', FlightSchema); 