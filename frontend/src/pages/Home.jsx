import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { getListings } from "../services/listingService";
import "../App.css";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setProperties(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredProperties = properties.filter((property) => {
    return (
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase())
    );
  });

 return (
  <PageWrapper>

    <div>
      <Navbar search={search} setSearch={setSearch} />

      <Hero />

      <section className="properties-section">
        <h2>Popular stays</h2>

       {loading ? (

  <div className="skeleton-grid">

    {[...Array(6)].map((_, index) => (

      <div
        className="skeleton-card"
        key={index}
      >

        <div className="skeleton-image"></div>

        <div className="skeleton-line"></div>

        <div className="skeleton-line short"></div>

      </div>

    ))}

  </div>

) : (
          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <PropertyCard
  key={property._id}
  property={property}
/>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>

</PageWrapper>
);
}