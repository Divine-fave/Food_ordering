import { Router } from 'express';
import { fakeAuth } from '../middleware/auth.middleware.js';
import { getOrdersByUser } from '../controllers/orders.controller.js';

const router = Router();

router.get('/:id/orders', fakeAuth, getOrdersByUser);

export default router;