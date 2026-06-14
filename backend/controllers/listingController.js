const Listing = require("../models/Listing");
const Review = require("../models/Review");

const getImageUrl = (req, file) => {
  const backendUrl =
    process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

  return `${backendUrl}/uploads/${file.filename}`;
};

const getListings = async (req, res) => {
  try {
    const listings = await Listing.find();

    const listingsWithRatings = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await Review.find({
          listing: listing._id,
        });

        const averageRating =
          reviews.length > 0
            ? (
                reviews.reduce(
                  (sum, review) => sum + Number(review.rating),
                  0
                ) / reviews.length
              ).toFixed(1)
            : null;

        return {
          ...listing.toObject(),
          averageRating,
          reviewCount: reviews.length,
        };
      })
    );

    res.status(200).json(listingsWithRatings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch listings",
    });
  }
};

const getSingleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch listing",
    });
  }
};

const createListing = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => getImageUrl(req, file));

    const listing = await Listing.create({
      title: req.body.title,
      location: req.body.location,
      mapUrl: req.body.mapUrl,
      price: req.body.price,
      extraGuestCharge: req.body.extraGuestCharge,
      // rating: req.body.rating,
      images: imagePaths,
      owner: req.user.id,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create listing",
    });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const canManage =
      listing.owner.toString() === req.user.id || req.user.isAdmin === true;

    if (!canManage) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    const imagePaths =
      req.files && req.files.length > 0
        ? req.files.map((file) => getImageUrl(req, file))
        : listing.images;

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        location: req.body.location,
        mapUrl: req.body.mapUrl,
        price: req.body.price,
        extraGuestCharge: req.body.extraGuestCharge,
        images: imagePaths,
      },
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update listing",
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const canManage =
      listing.owner.toString() === req.user.id || req.user.isAdmin === true;

    if (!canManage) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete listing",
    });
  }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user.id,
    });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your listings",
    });
  }
};

module.exports = {
  getListings,
  getSingleListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
};