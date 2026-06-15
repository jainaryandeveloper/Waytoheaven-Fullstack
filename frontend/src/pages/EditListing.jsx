import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import "../App.css";

export default function EditListing() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchListing = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}`
      );

      setFormData({
        title: response.data.title,
        location: response.data.location,
        mapUrl: response.data.mapUrl || "",
        images: [],
        price: response.data.price,
        extraGuestCharge:
          response.data.extraGuestCharge || "",
      });

      setPreview(response.data.images || []);
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    try {
      const token = JSON.parse(
        localStorage.getItem("user")
      )?.token;

      const data = new FormData();

      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("mapUrl", formData.mapUrl);
      data.append("price", formData.price);
      data.append(
        "extraGuestCharge",
        formData.extraGuestCharge
      );

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Listing updated successfully!");

      setUploading(false);
      navigate(`/listing/${id}`);
    } catch (error) {
      console.log(error);

      setUploading(false);

      toast.error(
        error.response?.data?.message ||
          "Not Authorized"
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div className="add-listing-container">
        <h2>Edit Listing</h2>

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
            disabled={uploading}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={uploading}
          />

          <input
            type="text"
            name="mapUrl"
            placeholder="Google Maps Embed URL"
            value={formData.mapUrl}
            onChange={handleChange}
            required
            disabled={uploading}
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

              const updatedPreview = [
                ...preview,
                ...files.map((file) =>
                  URL.createObjectURL(file)
                ),
              ];

              if (updatedPreview.length > 7) {
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

              setPreview(updatedPreview);

              e.target.value = "";
            }}
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
            disabled={uploading}
          />

          <input
            type="number"
            name="extraGuestCharge"
            placeholder="Extra charge per guest"
            value={formData.extraGuestCharge}
            onChange={handleChange}
            required
            disabled={uploading}
          />

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
              ? "Updating..."
              : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}