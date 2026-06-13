const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  deleteBooking,
  getListingBookings,
  getHostBookings,
  getBookingCountForListing,
} = require("../controllers/bookingController");

const router = express.Router();

router.get(
  "/my-bookings",
  protect,
  getMyBookings
);

router.get(
  "/host-bookings",
  protect,
  getHostBookings
);

router.get(
  "/listing/:listingId",
  getListingBookings
);

router.get(
  "/count/:listingId",
  protect,
  getBookingCountForListing
);

router.post(
  "/:listingId",
  protect,
  createBooking
);

router.delete(
  "/:id",
  protect,
  deleteBooking
);

module.exports = router;