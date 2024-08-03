import React, { useState, useEffect } from "react";
import axios from "axios";
import categories from "../components/category/CategoriesList";
import ListingCard from "../components/listing/ListingCard";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import "../styles/Search.scss";
import ListingGoogleMap from "../components/listing/ListingGoogleMap";
import { MdMap } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} next-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        cursor: "pointer",
        outline: "none",
      }}
      onClick={onClick}
      tabIndex={0}
    >
      <FaChevronLeft />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} prev-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        cursor: "pointer",
        outline: "none",
        zIndex: "1",
      }}
      onClick={onClick}
      tabIndex={0}
    >
      <FaChevronRight />
    </div>
  );
}

function Home() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const listingsPerPage = 8;
  const [category, setCategory] = useState("");
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/listing?category=${category}`)
      .then((response) => {
        setAllListings(response.data);
        setFilteredListings(response.data);
        setPageCount(Math.ceil(response.data.length / listingsPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings by category:", error);
        setLoading(false);
      });
  }, [category]);
  const handleCategoryClick = (label) => {
    setCategory(label);
  };

  const startIdx = page * listingsPerPage;
  const endIdx = startIdx + listingsPerPage;
  const displayedListings = filteredListings.slice(startIdx, endIdx);
  const containerStyle = {
    width: "2000px",
    height: "1000px",
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <>
      <div className="slider-container mb-5">
        <Container style={{ marginTop: "50px" }}>
          <Slider {...settings}>
            {categories.map((category) => (
              <div key={category.label}>
                <Card
                  className="rounded-circle border-0"
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick(category.label)}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center mb-3">
                      <category.Icon size={18} />
                    </div>
                    <Card.Title
                      className="text-center fw-medium"
                      style={{ fontSize: "10px" }}
                    >
                      {category.label ? category.label : "All"}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        </Container>
      </div>
      <div className="mb-5">
        <div className={showMap ? "d-none" : "pt-0"} id="listingContainer">
          <Container>
            {loading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Fetching Listings...</span>
              </Spinner>
            ) : (
              <Row xs={1} sm={2} md={2} lg={4}>
                {displayedListings.map((listing) => (
                  <Col lg="3" className="mb-4" key={listing._id}>
                    <ListingCard listing={listing} />
                  </Col>
                ))}
              </Row>
            )}

            <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
              {[...Array(pageCount).keys()].map((num) => (
                <span
                  key={num}
                  onClick={() => setPage(num)}
                  className={page === num ? "active_page" : ""}
                >
                  {num + 1}
                </span>
              ))}
            </div>
          </Container>
        </div>
        <div
          id="mapContainer"
          className={showMap ? "" : "d-none"}
          style={{ width: "100%", height: "100%" }}
        >
          <ListingGoogleMap
            listings={filteredListings}
            containerStyle={containerStyle}
          />
        </div>
      </div>
      <div
        className="
            p-3
            border
            border-secondary
            d-flex
            flex-row
            align-items-center
            rounded-pill
            shadow-sm
            bg-dark
            text-white
            position-fixed
            start-50
            translate-middle-x
          "
        style={{ cursor: "pointer", zIndex: 1000, bottom: "100px" }}
        onClick={toggleView}
      >
        {showMap ? "Show List" : "Show Map"}
        <MdMap />
      </div>
    </>
  );
}

export default Home;
