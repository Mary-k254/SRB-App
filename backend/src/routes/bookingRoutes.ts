import { Router } from 'express';
import { createBooking, getMyBookings, getActiveTrips, updateVehicleLocation } from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['PASSENGER']), createBooking);
router.get('/my', authenticate, authorize(['PASSENGER', 'DRIVER']), getMyBookings);
router.get('/active', authenticate, getActiveTrips);
router.patch('/location', authenticate, authorize(['DRIVER']), updateVehicleLocation);

export default router;
