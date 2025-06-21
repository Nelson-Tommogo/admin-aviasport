import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
}, { timestamps: { createdAt: false, updatedAt: true } });

export default mongoose.model('Settings', SettingsSchema); 