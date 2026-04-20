import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  getCustomerLoyalty
} from '../controllers/customerController.js';

const router = express.Router();

router.post('/', createCustomer);
router.get('/', protect, getAllCustomers);
router.get('/:id', protect, getCustomerById);
router.get('/:id/loyalty', protect, getCustomerLoyalty);

export default router;