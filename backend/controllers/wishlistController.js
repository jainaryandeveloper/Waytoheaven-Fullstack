const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const existing = await Wishlist.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Listing already in wishlist",
      });
    }

    const item = await Wishlist.create({
      user: req.user.id,
      listing: req.params.listingId,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add to wishlist",
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("listing");

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user.id,
      listing: req.params.listingId,
    });

    res.status(200).json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove from wishlist",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};