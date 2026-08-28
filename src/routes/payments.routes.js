import { Router } from 'express';
import { fakeAuth } from '../middleware/auth.middleware.js';
import { createPayment, getPaymentsForOrder } from '../controllers/payments.controller.js';

const router = Router();

router.post('/', fakeAuth, createPayment);
router.get('/:orderId', fakeAuth, getPaymentsForOrder);

export default router;