import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import "../App.css";
import { toast } from "react-toastify";

export default function AddListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    mapUrl: "",
    images: [],
    price: "",
    extraGuestCharge: "",
  });

  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setUploading(true);

    try {
      const token = JSON.parse(
        localStorage.getItem("user")
      )?.token;

      const data = new FormData();

      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("mapUrl", formData.mapUrl);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      data.append("price", formData.price);
      data.append(
        "extraGuestCharge",
        formData.extraGuestCharge
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/listings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Listing added successfully!");

      setUploading(false);
      navigate("/");
    } catch (error) {
      console.log(error);

      setUploading(false);

      toast.error(
        error.response?.data?.message ||
          "Failed to add listing"
      );
    }
  };

  return (
    <PageWrapper>
      <div>
        <Navbar />

        <div className="add-listing-container">
          <h2>Add New Listing</h2>

          <form
            onSubmit={handleSubmit}
            className="add-listing-form"
          >
            <input
              type="text"
              name="title"
              placeholder="Property Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="mapUrl"
              placeholder="Google Maps Embed URL"
              value={formData.mapUrl}
              onChange={handleChange}
            />

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files);

                const updatedImages = [
                  ...formData.images,
                  ...files,
                ];

                if (updatedImages.length > 7) {
                  toast.error(
                    "You can upload maximum 7 images"
                  );
                  e.target.value = "";
                  return;
                }

                setFormData({
                  ...formData,
                  images: updatedImages,
                });

                setPreview([
                  ...preview,
                  ...files.map((file) =>
                    URL.createObjectURL(file)
                  ),
                ]);

                e.target.value = "";
              }}
              required
            />

            {preview.length > 0 && (
              <div className="image-preview-grid">
                {preview.map((img, index) => (
                  <div
                    className="preview-wrapper"
                    key={index}
                  >
                    <button
                      type="button"
                      className="remove-preview-btn"
                      disabled={uploading}
                      onClick={() => {
                        const updatedPreview =
                          preview.filter(
                            (_, i) => i !== index
                          );

                        const updatedImages =
                          formData.images.filter(
                            (_, i) => i !== index
                          );

                        setPreview(updatedPreview);

                        setFormData({
                          ...formData,
                          images: updatedImages,
                        });
                      }}
                    >
                      ×
                    </button>

                    <img
                      src={img}
                      alt="Preview"
                      className="image-preview"
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="number"
              name="price"
              placeholder="Price per night"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="extraGuestCharge"
              placeholder="Extra charge per guest"
              value={formData.extraGuestCharge}
              onChange={handleChange}
              required
            />

            <div className="rating-info-box">
              ⭐ Ratings are automatically calculated
              from guest reviews after bookings.
            </div>

            {uploading && (
              <div className="uploading-box">
                <div className="upload-spinner"></div>
                <p>Uploading images, please wait...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className={uploading ? "disabled-btn" : ""}
            >
              {uploading
                ? "Uploading..."
                : "Add Listing"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}