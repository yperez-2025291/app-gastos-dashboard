import { Router } from 'express';
import { getEmergencyFund, updateEmergencyFund } from './emergency-fund.controller.js';

const router = Router();

router.get('/', getEmergencyFund);
router.post('/', updateEmergencyFund);

export default router;