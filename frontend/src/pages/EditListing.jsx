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
    // rating: "",
  });

  const [preview, setPreview] = useState([]);

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
        // rating: response.data.rating,
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
      // data.append("rating", formData.rating);

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

      navigate(`/listing/${id}`);
    } catch (error) {
      console.log(error);

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
            required
          />

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(
                e.target.files
              );

              if (files.length > 7) {
                toast.error(
                  "You can upload maximum 7 images"
                );
                return;
              }

              setFormData({
                ...formData,
                images: files,
              });

              setPreview(
                files.map((file) =>
                  URL.createObjectURL(file)
                )
              );
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

          onClick={() => {

            const updatedPreview =
              preview.filter(
                (_, i) =>
                  i !== index
              );

            const updatedImages =
              formData.images.filter(
                (_, i) =>
                  i !== index
              );

            setPreview(
              updatedPreview
            );

            setFormData({
              ...formData,
              images:
              updatedImages,
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

          {/* <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            required
          /> */}

          <button type="submit">
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
}