import Bet from '../models/Bet.js';
import Player from '../models/Player.js';
import Payout from '../models/Payout.js';
import Flight from '../models/Flight.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
  try {
    const { from, to } = req.query;
    let dateFilter = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to);
    }

    // Bets by result
    const betsByResult = await Bet.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$result', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);

    // Total payout amount
    const totalPayoutAmount = await Payout.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent bets (last 5)
    const recentBets = await Bet.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('player');
    // Recent players (last 5)
    const recentPlayers = await Player.find(dateFilter).sort({ createdAt: -1 }).limit(5);

    // Top players by bet amount
    const topPlayers = await Bet.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$player', totalBet: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalBet: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'players', localField: '_id', foreignField: '_id', as: 'player' } },
      { $unwind: '$player' }
    ]);

    // Totals
    const [totalBets, totalPlayers, totalPayouts, totalFlights, totalProducts] = await Promise.all([
      Bet.countDocuments(dateFilter),
      Player.countDocuments(dateFilter),
      Payout.countDocuments(dateFilter),
      Flight.countDocuments(dateFilter),
      Product.countDocuments(dateFilter),
    ]);

    res.json({
      totalBets,
      totalPlayers,
      totalPayouts,
      totalFlights,
      totalProducts,
      betsByResult,
      totalPayoutAmount: totalPayoutAmount[0]?.total || 0,
      recentBets,
      recentPlayers,
      topPlayers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 