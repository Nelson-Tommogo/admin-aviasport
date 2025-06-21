import Payout from '../models/Payout.js';

export const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().populate('player');
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPayoutById = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id).populate('player');
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    res.json(payout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPayout = async (req, res) => {
  try {
    const payout = new Payout(req.body);
    await payout.save();
    res.status(201).json(payout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePayout = async (req, res) => {
  try {
    const payout = await Payout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    res.json(payout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePayout = async (req, res) => {
  try {
    const payout = await Payout.findByIdAndDelete(req.params.id);
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    res.json({ message: 'Payout deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 