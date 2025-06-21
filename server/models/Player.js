import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Player', PlayerSchema); 