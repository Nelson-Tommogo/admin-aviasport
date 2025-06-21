import Bet from '../models/Bet.js';

export const getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find().populate('player flight');
    res.json(bets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBetById = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id).populate('player flight');
    if (!bet) return res.status(404).json({ error: 'Bet not found' });
    res.json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBet = async (req, res) => {
  try {
    const bet = new Bet(req.body);
    await bet.save();
    res.status(201).json(bet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBet = async (req, res) => {
  try {
    const bet = await Bet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bet) return res.status(404).json({ error: 'Bet not found' });
    res.json(bet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBet = async (req, res) => {
  try {
    const bet = await Bet.findByIdAndDelete(req.params.id);
    if (!bet) return res.status(404).json({ error: 'Bet not found' });
    res.json({ message: 'Bet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 