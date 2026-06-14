require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

connectDB();

/* Create uploads folder if it doesn't exist */
const uploadDir = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://waytoheaven-fullstack-git-main-jainaryandevelopers-projects.vercel.app",
      "https://waytoheaven-fullstack-dqjt0jlfm-jainaryandevelopers-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(uploadDir)
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/listings",
  listingRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.get("/", (req, res) => {
  res.send(
    "WayToHeaven API Running"
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On ${PORT}`
  );
});