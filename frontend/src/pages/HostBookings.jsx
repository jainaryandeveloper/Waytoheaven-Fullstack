import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchHostBookings = async () => {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/host-bookings`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings(res.data);
    };

    fetchHostBookings();
  }, []);

  return (
    <PageWrapper>
      <Navbar />

      <div className="host-bookings-page">
        <h1>Bookings on My Listings</h1>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>

            <h2>No guest bookings yet</h2>

            <p>
              When guests reserve your properties,
              bookings will appear here.
            </p>

            <button
              onClick={() =>
                (window.location.href = "/add-listing")
              }
            >
              Add New Listing
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking._id}
            >
              <h3 className="booking-title">
                {booking.listing?.title}
              </h3>

              <p className="booking-location">
                {booking.listing?.location}
              </p>

              <div className="booking-info-grid">
                <div className="booking-info-item">
                  Guest: {booking.user?.name}
                </div>

                <div className="booking-info-item">
                  Email: {booking.user?.email}
                </div>

                <div className="booking-info-item">
                  Check-in:{" "}
                  {booking.checkIn?.slice(0, 10)}
                </div>

                <div className="booking-info-item">
                  Check-out:{" "}
                  {booking.checkOut?.slice(0, 10)}
                </div>

                <div className="booking-info-item">
                  Guests: {booking.guests}
                </div>

                <div className="booking-info-item">
                  Nights: {booking.nights}
                </div>
              </div>

              <div className="booking-pricing">
                <p>
                  <span>Base Cost</span>
                  <strong>
                    ₹{booking.baseCost}
                  </strong>
                </p>

                <p>
                  <span>Extra Guest Cost</span>
                  <strong>
                    ₹{booking.extraGuestCost}
                  </strong>
                </p>

                <h3 className="booking-total">
                  Booking Amount: ₹
                  {booking.totalPrice}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </PageWrapper>
  );
}