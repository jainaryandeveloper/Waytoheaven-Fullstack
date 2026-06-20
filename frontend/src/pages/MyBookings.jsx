import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const handleCancelBooking = async (bookingId) => {
  const confirmCancel = window.confirm(
    "Cancel this booking?"
  );

  if (!confirmCancel) return;

  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await axios.delete(
     `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

  toast.success("Booking cancelled");

    setBookings(
      bookings.filter(
        (booking) => booking._id !== bookingId
      )
    );
  } catch (error) {
    console.log(error);

   toast.error(
  error.response?.data?.message ||
  "Failed to cancel booking"
);
  }
};

  useEffect(() => {
    const fetchBookings = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings(res.data);
    };

    fetchBookings();
  }, []);

 return (
  <PageWrapper>
    <>
      <Navbar />

      <div className="my-bookings-page">
        <h1>My Bookings</h1>

       {bookings.length === 0 ? (
<div className="empty-state">
  <div className="empty-icon">🧳</div>

  <h2>No bookings yet</h2>

  <p>
    When you book a stay, it will appear here.
  </p>

  <button onClick={() => window.location.href = "/"}>
    Explore Stays
  </button>
</div>
) : (
  bookings.map((booking) => (
    <div className="booking-card" key={booking._id}>
     <h3 className="booking-title">
  {booking.listing?.title}
</h3>

<p className="booking-location">
  {booking.listing?.location}
</p>
      <div className="booking-info-grid">
  <div className="booking-info-item">
    Check-in: {booking.checkIn?.slice(0, 10)}
  </div>

  <div className="booking-info-item">
    Check-out: {booking.checkOut?.slice(0, 10)}
  </div>

  <div className="booking-info-item">
    Guests: {booking.guests}
  </div>

  <div className="booking-info-item">
    Nights: {booking.nights}
  </div>
</div>
      {/* <p>Nights: {booking.nights}</p>

<p>Base Cost: ₹{booking.baseCost}</p>

<p>Extra Guest Cost: ₹{booking.extraGuestCost}</p> */}

<div className="booking-pricing">
{/* 
  <p>
    Nights:
    {booking.nights}
  </p> */}

  <p>
    Base:
    ₹{booking.baseCost}
  </p>

  <p>
    Extra Guest:
    ₹{booking.extraGuestCost}
  </p>

  <h3 className="booking-total">

    Total Paid:
    ₹{booking.totalPrice}

  </h3>

</div>
      {new Date(booking.checkIn) > new Date() && (
  <button
    className="cancel-booking-btn"
    onClick={() =>
      handleCancelBooking(booking._id)
    }
  >
    Cancel Booking
  </button>
)}
    </div>
  ))
)}
      </div>

      <Footer />
   </>

</PageWrapper>
);
}