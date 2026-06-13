const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    mapUrl: {
  type: String,
  default: "",
},

    images: {
  type: [String],
  required: true,
  validate: {
    validator: function (arr) {
      return arr.length >= 1 && arr.length <= 7;
    },
    message: "Upload between 1 and 7 images",
  },
},

    price: {
      type: Number,
      required: true,
    },
    extraGuestCharge: {
  type: Number,
  default: 0,
},

    rating: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Listing",
  listingSchema
);