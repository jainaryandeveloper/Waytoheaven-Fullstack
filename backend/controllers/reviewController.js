const Review = require("../models/Review");

const Booking = require("../models/Booking");

const Listing = require("../models/Listing");
const createReview = async (req, res) => {
  try {

    const { rating, comment } =
      req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message:
        "All fields required",
      });
    }

    const existingReview =
      await Review.findOne({

        user: req.user.id,

        listing:
        req.params.listingId,

      });

    if (existingReview) {

      return res.status(400).json({
        message:
        "You already reviewed this listing",
      });

    }
    const hasBooked =
await Booking.findOne({

  user: req.user.id,

  listing:
  req.params.listingId,

});
// const Listing = require("../models/Listing");

const listing =
await Listing.findById(
  req.params.listingId
);

if (
  listing.owner.toString() ===
  req.user.id
) {

  return res.status(403).json({

    message:
    "Hosts cannot review their own listings",

  });

}

if (!hasBooked) {

  return res.status(403).json({

    message:
    "You can review only after booking this listing",

  });

}

    const review =
      await Review.create({

        user: req.user.id,

        listing:
        req.params.listingId,

        rating,

        comment,

      });

    res.status(201).json(review);

  } catch (error) {

    res.status(500).json({
      message:
      "Failed to create review",
    });

  }
};

const getListingReviews =
async (req, res) => {

  try {

    const reviews =
      await Review.find({

        listing:
        req.params.listingId,

      })

      .populate(
        "user",
        "name"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      reviews
    );

  } catch (error) {

    res.status(500).json({
      message:
      "Failed to fetch reviews",
    });

  }
};
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(
      req.params.reviewId
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
    });
  }
};
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
};