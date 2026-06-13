import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  search = "",
  setSearch,
}) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] =
  useState(false);
  const [allListings, setAllListings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchRef = useRef(null);
const profileRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/listings`
        );

        setAllListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      if (
  profileRef.current &&
  !profileRef.current.contains(
    event.target
  )
) {
  setProfileOpen(false);
}
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

 const handleProfileClick = () => {
  setProfileOpen((prev) => !prev);
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    closeMenu();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch?.(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allListings.filter(
      (listing) =>
        listing.title
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        listing.location
          ?.toLowerCase()
          .includes(value.toLowerCase())
    );

    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (item) => {
    setSearch?.(item.location);
    setShowSuggestions(false);
    navigate(`/listing/${item._id}`);
  };

  return (
    <div className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        Waytoheaven
      </Link>

      <div
        className="search-wrapper"
        ref={searchRef}
      >
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search destinations"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowSuggestions(true)
            }
          >
            🔍
          </button>
        </div>

        {showSuggestions && (
          <div className="search-dropdown">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item._id}
                  className="search-item"
                  onClick={() =>
                    handleSuggestionClick(item)
                  }
                >
                  <strong>{item.title}</strong>
                  <span>{item.location}</span>
                </div>
              ))
            ) : (
              <div className="search-item no-result">
                No stays found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="nav-actions">
        <div className="hamburger-wrapper">
          <button
            ref={hamburgerRef}
            className="hamburger-btn"
            type="button"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
          >
            ☰
          </button>

          <div
            ref={menuRef}
            className={`nav-right ${
              menuOpen ? "menu-open" : ""
            }`}
          >
            {user ? (
              <>
                <button
                  className="add-nav-btn"
                  onClick={() => {
                    navigate("/add-listing");
                    closeMenu();
                  }}
                >
                  Add Listing
                </button>

                <button
                  className="add-nav-btn"
                  onClick={() => {
                    navigate("/my-listings");
                    closeMenu();
                  }}
                >
                  My Listings
                </button>

                <button
                  className="add-nav-btn"
                  onClick={() => {
                    navigate("/my-bookings");
                    closeMenu();
                  }}
                >
                  My Bookings
                </button>

                <button
                  className="add-nav-btn"
                  onClick={() => {
                    navigate("/wishlist");
                    closeMenu();
                  }}
                >
                  Wishlist
                </button>

                <button
                  className="add-nav-btn"
                  onClick={() => {
                    navigate("/host-bookings");
                    closeMenu();
                  }}
                >
                  Host Bookings
                </button>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="register-btn"
                onClick={() => {
                  navigate("/register");
                  closeMenu();
                }}
              >
                Register
              </button>
            )}
          </div>
        </div>
<div className="profile-theme-group">

  <div
    className="profile-wrapper"
    ref={profileRef}
  >

    <button
      className="profile-icon"
      onClick={() =>
        setProfileOpen(
          (prev) => !prev
        )
      }
    >
      👤
    </button>

    {profileOpen && (
      <div className="profile-card">

        {user ? (
          <>
            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                setProfileOpen(false);
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h3>Welcome</h3>

            <p>
              Login to manage bookings and wishlist.
            </p>

            <button
              onClick={() => {
                setProfileOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>

            <button
              onClick={() => {
                setProfileOpen(false);
                navigate("/register");
              }}
            >
              Register
            </button>
          </>
        )}

      </div>
    )}

  </div>

  <button
    className="theme-toggle"
    onClick={toggleTheme}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

</div>
      </div>
    </div>
  );
}