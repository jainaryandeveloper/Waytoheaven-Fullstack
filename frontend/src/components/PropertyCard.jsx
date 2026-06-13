import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !property?._id) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const saved = res.data.some(
        (item) => item.listing?._id === property._id
      );

      setIsSaved(saved);
    };

    checkWishlist();
  }, [property?._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        toast.error("Please login first");
        return;
      }

      if (isSaved) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${property._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setIsSaved(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${property._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setIsSaved(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Wishlist action failed"
      );
    }
  };

  return (
    <Link
      to={`/listing/${property._id}`}
      className="property-link"
    >
      <div className="property-card">
        <button
          className={`wishlist-btn ${
            isSaved ? "saved" : ""
          }`}
          onClick={handleWishlist}
        >
          {isSaved ? "❤️" : "🤍"}
        </button>
<img
 src={
  property.images?.[0] ||
  property.image ||
  "https://via.placeholder.com/500x350"
}
  alt={property.title}
  className="property-image"
/>
        <div className="property-info">
          <div className="property-header">
            <h3>{property.title}</h3>
           {property.reviewCount > 0 && (
  <span>
    ⭐ {property.averageRating}
  </span>
)}
          </div>

          <p>{property.location}</p>

          <p className="price">
            ₹{property.price} night
          </p>
        </div>
      </div>
    </Link>
  );
}