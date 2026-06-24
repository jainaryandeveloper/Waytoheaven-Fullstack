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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const updatedImages = [...formData.images, ...files];

    if (updatedImages.length > 7) {
      toast.error("You can upload maximum 7 images");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!formData.title || !formData.location || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("mapUrl", formData.mapUrl);
      data.append("price", formData.price);
      data.append("extraGuestCharge", formData.extraGuestCharge);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/listings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;

            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percent);
          },
        }
      );

      toast.success("Listing added successfully!");

      setFormData({
        title: "",
        location: "",
        mapUrl: "",
        images: [],
        price: "",
        extraGuestCharge: "",
      });

      setPreview([]);
      setUploading(false);

      navigate("/");
    } catch (error) {
      console.log("ADD LISTING ERROR:", error);

      setUploading(false);

      toast.error(
        error.response?.data?.message || "Failed to add listing"
      );
    }
  };

  return (
    <PageWrapper>
      <div>
        <Navbar />

        <div className="add-listing-container">
          <h2>Add New Listing</h2>

          <form onSubmit={handleSubmit} className="add-listing-form">
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
              onChange={handleImageChange}
            />

            {preview.length > 0 && (
              <div className="image-preview-grid">
                {preview.map((img, index) => (
                  <div className="preview-wrapper" key={index}>
                    <button
                      type="button"
                      className="remove-preview-btn"
                      disabled={uploading}
                      onClick={() => removeImage(index)}
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
              ⭐ Ratings are automatically calculated from guest reviews after
              bookings.
            </div>

            {uploading && (
              <div className="uploading-box">
                <div className="upload-spinner"></div>

                <div className="upload-progress-info">
                  <p>Uploading images... {uploadProgress}%</p>

                  <div className="upload-progress-bar">
                    <div
                      className="upload-progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className={uploading ? "disabled-btn" : ""}
            >
              {uploading ? "Uploading..." : "Add Listing"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}