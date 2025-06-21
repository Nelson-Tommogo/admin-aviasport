import express from 'express';
import {
  getAllFlightPlans,
  getFlightPlanById,
  createFlightPlan,
  updateFlightPlan,
  deleteFlightPlan
} from '../controllers/flightPlanController.js';

const router = express.Router();

router.get('/', getAllFlightPlans);
router.get('/:id', getFlightPlanById);
router.post('/', createFlightPlan);
router.put('/:id', updateFlightPlan);
router.delete('/:id', deleteFlightPlan);

export default router; 