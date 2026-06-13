import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import PageWrapper from "../components/PageWrapper";
export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
         `${import.meta.env.VITE_API_URL}/api/listings/my-listings`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setListings(res.data);

        const counts = {};

        for (let listing of res.data) {
          const countRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/bookings/count/${listing._id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          counts[listing._id] = countRes.data.count;
        }

        setBookingCounts(counts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyListings();
  }, [navigate]);

 return (
  <PageWrapper>
    <>
      <Navbar />

      <div className="my-listings-page">
        <h1>My Listings</h1>

        {listings.length === 0 ? (
          <div className="empty-listings">
           <div className="empty-state">
  <div className="empty-icon">🏡</div>

  <h2>No listings created</h2>

  <p>
    Create your first property listing
    and start hosting guests.
  </p>

  <button
    onClick={() =>
      window.location.href =
      "/add-listing"
    }
  >
    Create Listing
  </button>
</div>

            
          </div>
        ) : (
          <div className="property-grid">
            {listings.map((property) => (
              <div key={property._id}>
                <PropertyCard property={property} />

                <p className="booking-count">
                  Bookings: {bookingCounts[property._id] || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>

</PageWrapper>
);
}