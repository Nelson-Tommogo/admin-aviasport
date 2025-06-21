import mongoose from 'mongoose';

const BetSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  amount: { type: Number, required: true },
  odds: { type: Number, required: true },
  result: { type: String, enum: ['win', 'lose', 'pending'], default: 'pending' },
  payout: { type: Number, default: 0 },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
}, { timestamps: true });

export default mongoose.model('Bet', BetSchema); 