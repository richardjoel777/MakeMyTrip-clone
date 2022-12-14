import express from "express";
import { auth } from "../../middlewares/auth/auth.js";

import hotelControllers from "../../controllers/hotels/index.js";

const {
  getHotel,
  getHotels,
  bookHotel,
  getBookings,
  checkPromoCode,
  cancelBooking,
  isAvailable,
  checkAvailability,
} = hotelControllers;

const router = express.Router();

router.get("/hotel-details", getHotel);
router.get("/hotel-listings", getHotels);
router.post("/is-available", isAvailable);
router.post("/book-hotel", auth, bookHotel);
router.get("/bookings", auth, getBookings);
router.post("/check-promo-code", checkPromoCode);
router.get("/cancel-booking/:id", auth, cancelBooking);
router.post("/check-availability", checkAvailability);

export default router;
