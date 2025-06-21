import express from 'express';
import {
  getAllBets,
  getBetById,
  createBet,
  updateBet,
  deleteBet
} from '../controllers/betController.js';

const router = express.Router();

router.get('/', getAllBets);
router.get('/:id', getBetById);
router.post('/', createBet);
router.put('/:id', updateBet);
router.delete('/:id', deleteBet);

export default router; 