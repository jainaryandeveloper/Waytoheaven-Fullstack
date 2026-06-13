import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentImage, setCurrentImage] =
  useState(0);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const [reviewData, setReviewData] = useState({
    rating: "",
    comment: "",
  });
const [editingReviewId, setEditingReviewId] =
  useState(null);

const [editReviewData, setEditReviewData] =
  useState({
    rating: "",
    comment: "",
  });
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const fetchListing = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}`
      );

      setListing(response.data);
    };

    const fetchBookedDates = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/listing/${id}`
      );

      setBookedDates(response.data);
    };

    const fetchReviews = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/${id}`
      );

      setReviews(response.data);
    };

    fetchListing();
    fetchBookedDates();
    fetchReviews();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      const token = JSON.parse(
        localStorage.getItem("user")
      )?.token;

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Listing deleted");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Not Authorized");
    }
  };

  const handleBooking = () => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    if (
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.guests
    ) {
      toast.error("Please fill all booking fields");
      return;
    }

    if (nights <= 0) {
      toast.error(
        "Ending date must be after starting date"
      );
      return;
    }
const selectedStart =
  new Date(bookingData.checkIn);

const selectedEnd =
  new Date(bookingData.checkOut);

const rangeOverlap =
  bookedDates.some((booking) => {
    const bookedStart =
      new Date(booking.checkIn);

    const bookedEnd =
      new Date(booking.checkOut);

    return (
      selectedStart <= bookedEnd &&
      selectedEnd >= bookedStart
    );
  });

if (rangeOverlap) {
  toast.error(
    "Selected date range is already booked"
  );
  return;
}
    navigate("/checkout", {
      state: {
        listing,
        bookingData,
        nights,
        baseCost,
        extraGuestCost,
        totalPrice,
      },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews/${id}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      const updatedReviews = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/${id}`
      );

      setReviews(updatedReviews.data);

      setReviewData({
        rating: "",
        comment: "",
      });

      toast.success("Review added!");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add review"
      );
    }
  };
  const handleUpdateReview = async (reviewId) => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
      editReviewData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const updatedReviews = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/reviews/${id}`
    );

    setReviews(updatedReviews.data);

    setEditingReviewId(null);

    setEditReviewData({
      rating: "",
      comment: "",
    });

    toast.success("Review updated");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to update review"
    );
  }
};
  const handleDeleteReview = async (reviewId) => {
  const confirmDelete = window.confirm(
    "Delete this review?"
  );

  if (!confirmDelete) return;

  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setReviews(
      reviews.filter(
        (review) => review._id !== reviewId
      )
    );

    toast.success("Review deleted");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to delete review"
    );
  }
};
  

  if (!listing) {
    return <h2>Loading...</h2>;
  }

  const isOwner =
    user &&
    listing.owner &&
    listing.owner.toString() === user._id;

  const canManageListing =
    isOwner || user?.isAdmin;

  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
          (new Date(bookingData.checkOut) -
            new Date(bookingData.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const guests =
    Number(bookingData.guests) || 1;

  const baseCost =
    nights * Number(listing?.price || 0);

  const extraGuestCost =
    guests > 1
      ? (guests - 1) *
        Number(listing?.extraGuestCharge || 0)
      : 0;

  const totalPrice =
    baseCost + extraGuestCost;

  return (
    <PageWrapper>
      <div>
        <Navbar />

        <div className="details-container">
          <div className="details-image-wrapper">
  <img
  key={currentImage}
src={
  listing.images?.[currentImage] ||
  listing.image ||
  "https://via.placeholder.com/900x500"
}
  alt={listing.title}
  className="details-image"
/>

  {listing.images?.length > 1 && (
    <>
      <button
        className="image-arrow left-arrow"
        onClick={() =>
          setCurrentImage(
            currentImage === 0
              ? listing.images.length - 1
              : currentImage - 1
          )
        }
      >
        ‹
      </button>

      <button
        className="image-arrow right-arrow"
        onClick={() =>
          setCurrentImage(
            currentImage === listing.images.length - 1
              ? 0
              : currentImage + 1
          )
        }
      >
        ›
      </button>

      <div className="image-count">
        {currentImage + 1} / {listing.images.length}
      </div>
    </>
  )}
</div>

          <h1>{listing.title}</h1>

          <p>{listing.location}</p>

{reviews.length > 0 ? (
  <p>
    ⭐{" "}
    {(
      reviews.reduce(
        (sum, review) =>
          sum + Number(review.rating),
        0
      ) / reviews.length
    ).toFixed(1)}
    {" "}({reviews.length} reviews)
  </p>
) : (
  <p>No reviews yet</p>
)}

          <div className="booking-map-row">
            {user && (
              <div className="booking-left">
                <form
                  className="booking-form"
                  onSubmit={(e) =>
                    e.preventDefault()
                  }
                >
                  <h2>Book this stay</h2>

                  <label>Starting Date</label>

                  <input
  type="date"

  min={
    new Date()
      .toISOString()
      .split("T")[0]
  }

  value={bookingData.checkIn}

  onChange={(e) =>
    setBookingData({
      ...bookingData,
      checkIn: e.target.value,
    })
  }

  onBlur={(e) => {

    const selected =
      new Date(e.target.value);

    const overlap =
      bookedDates.some((booking) => {

        const start =
          new Date(
            booking.checkIn
          );

        const end =
          new Date(
            booking.checkOut
          );

        return (
          selected >= start &&
          selected <= end
        );

      });

    if (overlap) {

      toast.error(
        "This date is already booked"
      );

      setBookingData({
        ...bookingData,
        checkIn: "",
      });

    }

  }}

  required
/>

                  <label>Ending Date</label>
<input
  type="date"

  min={
    bookingData.checkIn ||
    new Date()
      .toISOString()
      .split("T")[0]
  }

  value={bookingData.checkOut}

  onChange={(e) =>
    setBookingData({
      ...bookingData,
      checkOut: e.target.value,
    })
  }

  onBlur={(e) => {

    const selected =
      new Date(e.target.value);

    const overlap =
      bookedDates.some((booking) => {

        const start =
          new Date(
            booking.checkIn
          );

        const end =
          new Date(
            booking.checkOut
          );

        return (
          selected >= start &&
          selected <= end
        );

      });

    if (overlap) {

      toast.error(
        "This date is already booked"
      );

      setBookingData({
        ...bookingData,
        checkOut: "",
      });

    }

  }}

  required
/>

                  <label>Guests</label>

                  <input
                    type="number"
                    placeholder="Guests"
                    min="1"
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guests: e.target.value,
                      })
                    }
                    required
                  />

                  {nights > 0 && (
                    <div className="price-breakdown">
                      <p>
                        Base: ₹{listing.price} ×{" "}
                        {nights} nights = ₹
                        {baseCost}
                      </p>

                      <p>
                        Extra Guests: ₹
                        {listing.extraGuestCharge ||
                          0}{" "}
                        ×{" "}
                        {Math.max(
                          guests - 1,
                          0
                        )}{" "}
                        = ₹{extraGuestCost}
                      </p>

                      <h3>Total: ₹{totalPrice}</h3>
                    </div>
                  )}

                  {bookedDates.length > 0 && (
                    <div className="booked-dates-box">
                      <h3>Already Booked Dates</h3>
{bookedDates.map((booking) => (

  <div
    key={booking._id}
    className="booked-date-item"
  >

    

    {new Date(
      booking.checkIn
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    )}

    {" → "}

    {new Date(
      booking.checkOut
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
          year: "numeric",
      }
    )}

  </div>

))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>
                </form>
              </div>
            )}

            {listing.mapUrl && (
              <div className="map-section booking-map">
                <h2>📍 Location</h2>

                <iframe
                  src={listing.mapUrl}
                  title="Google Map"
                  className="google-map"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {canManageListing && (
            <div className="details-actions">
              <Link
                to={`/edit-listing/${id}`}
                className="edit-btn"
              >
                Edit Listing
              </Link>

              <button
                className="delete-btn"
                onClick={handleDelete}
              >
                Delete Listing
              </button>
            </div>
          )}

          <div className="review-section">
            <h2>
  Reviews{" "}
  {reviews.length > 0 && (
    <span className="review-summary">
      ⭐{" "}
      {(
        reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating),
          0
        ) / reviews.length
      ).toFixed(1)}
      {" "}({reviews.length})
    </span>
  )}
</h2>

            {user ? (
              <form
                className="review-form"
                onSubmit={handleReviewSubmit}
              >
              <div className="star-rating-input">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      onClick={() =>
        setReviewData({
          ...reviewData,
          rating: star,
        })
      }
      onDoubleClick={() =>
        setReviewData({
          ...reviewData,
          rating: star - 0.5,
        })
      }
      className={
        reviewData.rating >= star
          ? "star active"
          : reviewData.rating >= star - 0.5
          ? "star half"
          : "star"
      }
    >
      ★
    </span>
  ))}
</div>
<p className="rating-help">
  Click for full star, double-click for half star.
</p>

                <textarea
                  placeholder="Write your review"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      comment: e.target.value,
                    })
                  }
                  required
                ></textarea>

                <button type="submit">
                  Add Review
                </button>
              </form>
            ) : (
              <p>
                Please login to add a review.
              </p>
            )}

            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
             reviews.map((review) => (
  <div key={review._id} className="review-card">
  <div className="review-top">
    <h4 className="review-user">
      {review.user?.name}
    </h4>

    <span className="review-stars">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;

        if (Number(review.rating) >= starValue) {
          return "★";
        }

        if (Number(review.rating) >= starValue - 0.5) {
          return "⯪";
        }

        return "☆";
      })}
    </span>
  </div>

  {editingReviewId === review._id ? (
    <div className="edit-review-box">
      <input
        type="number"
        min="1"
        max="5"
        step="0.5"
        value={editReviewData.rating}
        onChange={(e) =>
          setEditReviewData({
            ...editReviewData,
            rating: e.target.value,
          })
        }
      />

      <textarea
        value={editReviewData.comment}
        onChange={(e) =>
          setEditReviewData({
            ...editReviewData,
            comment: e.target.value,
          })
        }
      />

      <button onClick={() => handleUpdateReview(review._id)}>
        Save
      </button>
<button
  className="cancel-review-btn"
  onClick={() => setEditingReviewId(null)}
>
  Cancel
</button>
    </div>
  ) : (
    <>
      <p>{review.comment}</p>

      <span className="review-date">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>

      {user &&
        (review.user?._id === user._id || user.isAdmin) && (
          <div className="review-actions">
            <button
              className="edit-review-btn"
              onClick={() => {
                setEditingReviewId(review._id);
                setEditReviewData({
                  rating: review.rating,
                  comment: review.comment,
                });
              }}
            >
              Edit Review
            </button>

            <button
              className="delete-review-btn"
              onClick={() => handleDeleteReview(review._id)}
            >
              Delete Review
            </button>
          </div>
        )}
    </>
  )}
</div>
))
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}