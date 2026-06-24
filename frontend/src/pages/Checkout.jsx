import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import axios from "axios";
import { toast } from "react-toastify";


export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const {
    listing,
    bookingData,
    nights,
    baseCost,
    extraGuestCost,
    totalPrice,
  } = data;

 const handleConfirmBooking = async () => {
  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const { data } =
      await axios.post(

        `${import.meta.env.VITE_API_URL}/api/payments/create-order`,

        {
          amount: totalPrice,
        },

        {
          headers: {
            Authorization:
            `Bearer ${user.token}`,
          },
        }

      );

    const options = {

      key:
      import.meta.env
      .VITE_RAZORPAY_KEY,

      amount:
      data.amount,

      currency:
      data.currency,

      name:
      "WayToHeaven",

      description:
      listing.title,

      order_id:
      data.id,

     handler: async function (response) {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payments/verify-payment`,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/bookings/${listing._id}`,
      {
        ...bookingData,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        paymentStatus: "paid",
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    toast.success("Payment verified and booking confirmed!");
    navigate("/my-bookings");
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Payment verification failed"
    );
  }
},

      prefill: {

        name:
        user.name,

        email:
        user.email,

      },

      theme: {
        color:
        "#2f6fed",
      },

    };

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.open();

  } catch (error) {

    console.log(error);

    toast.error(
      "Payment Failed"
    );

  }
};

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="checkout-page">
          <h2>No checkout data found</h2>
          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  

  return (
    <PageWrapper>
      <Navbar />

      <div className="checkout-page">
        <div className="checkout-card">
          <h1>Checkout</h1>

         <img
  src={
    listing.images?.[0] ||
    listing.image ||
    "https://via.placeholder.com/900x500"
  }
  alt={listing.title}
  className="checkout-image"
/>

          <h2>{listing.title}</h2>
          <p>{listing.location}</p>

          <hr />

          <p>Check-in: {bookingData.checkIn}</p>
          <p>Check-out: {bookingData.checkOut}</p>
          <p>Guests: {bookingData.guests}</p>
          <p>Nights: {nights}</p>

          <hr />

          <p>Base Cost: ₹{baseCost}</p>
          <p>Extra Guest Cost: ₹{extraGuestCost}</p>

          <h2>Total: ₹{totalPrice}</h2>

          <button
  className="pay-btn"
  onClick={handleConfirmBooking}
>
  Confirm Booking
</button>
        </div>
      </div>

      <Footer />
    </PageWrapper>
  );
}