const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.post(
  "/:listingId",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.delete(
  "/:listingId",
  protect,
  removeFromWishlist
);

module.exports = router;