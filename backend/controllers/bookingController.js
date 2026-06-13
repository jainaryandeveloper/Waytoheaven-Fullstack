const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "All booking fields are required",
      });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({
        message: "Ending date must be after starting date",
      });
    }

    if (guests <= 0) {
      return res.status(400).json({
        message: "Guests must be at least 1",
      });
    }

    const existingBooking = await Booking.findOne({
      listing: req.params.listingId,
      $or: [
        {
          checkIn: {
            $lte: checkOut,
          },
          checkOut: {
            $gte: checkIn,
          },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Selected dates already booked",
      });
    }

    const listing =
  await Listing.findById(
    req.params.listingId
  );

const nights =
  Math.ceil(
    (
      new Date(checkOut) -
      new Date(checkIn)
    ) /
    (1000 * 60 * 60 * 24)
  );

const baseCost =
  nights *
  Number(listing.price);

const extraGuestCost =
  guests > 1
    ? (guests - 1) *
      Number(
        listing.extraGuestCharge || 0
      )
    : 0;

const totalPrice =
  baseCost +
  extraGuestCost;

const booking =
await Booking.create({

  user: req.user.id,

  listing:
  req.params.listingId,

  checkIn,

  checkOut,

  guests,

  nights,

  baseCost,

  extraGuestCost,

  totalPrice,

});

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    }).populate("listing");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

const getListingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      listing: req.params.listingId,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch listing bookings",
    });
  }
};

const getHostBookings = async (req, res) => {
  try {
    const myListings = await Listing.find({
      owner: req.user.id,
    });

    const listingIds = myListings.map(
      (listing) => listing._id
    );

    const bookings = await Booking.find({
      listing: {
        $in: listingIds,
      },
    })
      .populate("listing")
      .populate("user", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch host bookings",
    });
  }
};

const getBookingCountForListing = async (req, res) => {
  try {
    const count = await Booking.countDocuments({
      listing: req.params.listingId,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking count",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  deleteBooking,
  getListingBookings,
  getHostBookings,
  getBookingCountForListing,
};