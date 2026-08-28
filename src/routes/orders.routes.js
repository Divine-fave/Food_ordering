import { Router } from 'express';
import { fakeAuth } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orders.controller.js';

const router = Router();

router.post('/', fakeAuth, createOrder);
router.get('/', fakeAuth, getOrders);
router.get('/:id', fakeAuth, getOrderById);
router.patch('/:id/status', fakeAuth, updateOrderStatus);

export default router;