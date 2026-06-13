import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import PageWrapper from "../components/PageWrapper";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/wishlist`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setWishlist(res.data);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist = async (listingId) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  return (
    <PageWrapper>
      <Navbar />

      <div className="wishlist-page">
        <h1>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>

            <h2>No saved stays yet</h2>

            <p>
              Save your favourite properties and
              they will appear here.
            </p>
          </div>
        ) : (
          <div className="properties-grid">
            {wishlist.map((item) => (
              <div
                className="wishlist-card-wrapper"
                key={item._id}
              >
                <PropertyCard
                  property={item.listing}
                />

                <button
                  className="remove-wishlist-btn"
                  onClick={() =>
                    removeWishlist(
                      item.listing._id
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </PageWrapper>
  );
}