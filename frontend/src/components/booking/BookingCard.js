import React, { useState } from "react";
import { Card, CardBody, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Card.scss";

function BookingCard({ booking }) {
  const { signedUrls, city, country, _id } = booking.listing;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const showCancelButton = () => {
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const diffTime = Math.abs(checkInDate - now);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    return booking.bookingStatus === "Confirmed" && diffHours > 48;
  };

  const handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(true);
  };

  const cancelBooking = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/booking/cancel/${booking._id}`
      );
      setShowModal(false);
      window.location.reload(); // To show the booking has been moved to Cancelled Trips
    } catch (error) {
      alert("Failed to cancel booking: " + error.message);
      console.error("Error cancelling booking:", error);
      setShowModal(false);
    }
  };

  return (
    <div className="booking_card">
      <Link
        to={`/listings/${_id}`}
        style={{ cursor: "pointer" }}
        className="text-decoration-none mb-4"
      >
        <Card className="border-0 shadow">
          <img
            src={signedUrls[0]}
            alt=""
            className="booking_img"
            style={{ height: "125px", width: "200px" }}
          />
        </Card>
        <CardBody>
          <div className="d-flex flex-column">
            <h6
              className="booking_location d-flex text-dark text-opacity-75"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {city}, {country}
            </h6>
            <span className="text-info text-dark text-opacity-75">
              Hosted By {booking.listing.host?.username}
            </span>
            <span className="text-info text-dark text-opacity-75">
              {formatDate(booking.checkInDate)} -{" "}
              {formatDate(booking.checkOutDate)}
            </span>
            <Link
              to={`/contact_host/${booking.listing.host._id}`}
              className="mt-2 w-100"
            >
              <Button variant="dark" className="mt-2 w-100">
                Message Host
              </Button>
            </Link>
            {showCancelButton() && (
              <Button
                variant="danger"
                className="mt-2 w-100"
                onClick={handleCancelClick}
              >
                Cancel Rental
              </Button>
            )}
          </div>
        </CardBody>
      </Link>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>Cancellation Confirmation</strong>
          <br />
          <br />
          You are within the 48-hour window that allows for a full refund.
          Please note that the refund may take up to 5 business days to process.
          <br />
          <br />
          Are you sure you want to cancel your booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={cancelBooking}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookingCard;
