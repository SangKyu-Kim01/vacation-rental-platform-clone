import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ListingDetails.scss";
import ListingImageGallery from "../components/listing/ListingImageGallery";
import Amenities from "../components/listing/Amenities";
import BookingWidget from "../components/booking/BookingWidget";
import ListingInfo from "../components/listing/ListingInfo";
import HostInfo from "../components/host/HostInfo";
import ListingGoogleMap from "../components/listing/ListingGoogleMap";
import ReviewInfo from "../components/listing/ReviewInfo";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const containerStyle = {
    width: "70%",
    height: "400px",
  };
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/listing/${id}`
        );
        setListing(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };
    fetchListing();
  }, [id]);

  const { title } = listing || {};

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-4 bg-light" style={{ marginTop: "125px" }}>
      <Container className="p-3 mb-3">
        <>
          {/* Title */}
          <h1>{title}</h1>
          <ListingImageGallery listing={listing} />
          {/* Listing Informations */}
          <div className="listing-info">
            {/* Location */}
            <div className="">
              <ListingInfo listing={listing} />
              {/* Amenities */}
              <Amenities listing={listing} />
            </div>
            {/* Booking widget */}
            {listing && <BookingWidget listing={listing} />}
          </div>
          {/* Review Information */}
          <ReviewInfo listing={listing} />
          {/* Google map Location */}
          <div className="mt-4 border-bottom pb-3">
            <h4>Where you'll be</h4>
            <h6>
              {listing.city}, {listing.province}, {listing.country}
            </h6>
            <ListingGoogleMap
              listings={[listing]}
              containerStyle={containerStyle}
            />
          </div>
          {/* Host Details */}
          <HostInfo listing={listing} />
        </>
      </Container>
    </div>
  );
}

export default ListingDetails;
