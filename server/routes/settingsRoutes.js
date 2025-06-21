import express from 'express';
import {
  getAllSettings,
  getSettingById,
  createSetting,
  updateSetting,
  deleteSetting
} from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getAllSettings);
router.get('/:id', getSettingById);
router.post('/', createSetting);
router.put('/:id', updateSetting);
router.delete('/:id', deleteSetting);

export default router; 