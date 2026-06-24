import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddListing from "./pages/AddListing";
import ListingDetails from "./pages/ListingDetails";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import MyBookings from "./pages/MyBookings";
import HostBookings from "./pages/HostBookings";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
function App() {
  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
  path="/add-listing"
  element={
    <ProtectedRoute>
      <AddListing />
    </ProtectedRoute>
  }
/>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/listing/:id"
          element={<ListingDetails />}
        />

        <Route
  path="/edit-listing/:id"
  element={
    <ProtectedRoute>
      <EditListing />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-listings"
  element={
    <ProtectedRoute>
      <MyListings />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/host-bookings"
  element={
    <ProtectedRoute>
      <HostBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/host-bookings"
  element={
    <ProtectedRoute>
      <HostBookings />
    </ProtectedRoute>
  }
/>
<Route path="*" 
element={<NotFound />} />

<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
<Route
  path="/wishlist"
  element={
    <ProtectedRoute>
      <Wishlist />
    </ProtectedRoute>
  }
/>
      </Routes>

    </BrowserRouter>

  );
}

export default App;