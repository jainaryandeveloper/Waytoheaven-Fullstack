const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getListings,
  getSingleListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/listingController");

const router = express.Router();

router.get(
  "/",
  getListings
);

router.get(
  "/my-listings",
  protect,
  getMyListings
);

router.get(
  "/:id",
  getSingleListing
);

router.post(
  "/",
  protect,
  upload.array("images", 7),
  createListing
);

router.put(
  "/:id",
  protect,
  upload.array("images", 7),
  updateListing
);

router.delete(
  "/:id",
  protect,
  deleteListing
);

module.exports = router;