const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.post(
  "/:listingId",
  protect,
  createReview
);

router.get(
  "/:listingId",
  getListingReviews
);
router.put(
  "/:reviewId",
  protect,
  updateReview
);
router.delete(
  "/:reviewId",
  protect,
  deleteReview
);
module.exports = router;