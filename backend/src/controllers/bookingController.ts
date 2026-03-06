import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, getRLSFilter } from '../middleware/auth';
import { z } from 'zod';

const bookingSchema = z.object({
  tripId: z.string().uuid(),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
});

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, pickupLat, pickupLng, dropoffLat, dropoffLng } = bookingSchema.parse(req.body);
    const userId = req.user!.id;

    const booking = await prisma.booking.create({
      data: { passengerId: userId, tripId, pickupLat, pickupLng, dropoffLat, dropoffLng },
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const filter = getRLSFilter(req.user);
    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        trip: {
          include: {
            vehicle: true,
            route: true,
            driver: { select: { name: true, email: true } },
          },
        },
      },
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateVehicleLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleId, lat, lng } = req.body;
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { currentLat: lat, currentLng: lng, isOnline: true },
    });
    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getActiveTrips = async (req: AuthRequest, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { status: 'ACTIVE' },
      include: {
        vehicle: true,
        route: true,
        driver: { select: { name: true } },
      },
    });
    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
