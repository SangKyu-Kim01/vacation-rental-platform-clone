import React, { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import "../../styles/ListingDetails.scss";
import Calendar from "./Calendar";
import axios from "axios";
import { useGetMyUser } from "../../api/UserApi";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';

function BookingWidget({ listing }) {
  const { currentUser } = useGetMyUser();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);  

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const pricePerNight = parseFloat(listing.pricePerNight["$numberDecimal"] || 0);
  const totalPrice = numberOfNights * pricePerNight;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      setShowDateModal(true);  
      return;
    }

    if (numberOfGuests > listing.guestCount || numberOfGuests < 1) {
      setShowModal(true);
      return;
    }

    if (!listing._id || !currentUser) {
      toast.error("Booking cannot be processed. Check listing details or user authentication.");
      return;
    }

    const items = [
      {
        userId: currentUser._id,
        listingId: listing._id.toString(),
        title: listing.title,
        host: listing.host.username,
        image: listing.signedUrls[0],
        checkInDate: checkIn,
        checkOutDate: checkOut,
        price: totalPrice,
        bookingStatus: "Confirmed",
        quantity: 1,
      },
    ];

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/payment`,
        { items }
      );
      window.location = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      toast.error("Failed to create booking session.");
    }
  };

  return (
    <div className="booking-info bg-white p-2 shadow w-75 mx-5">
      <h5 className="my-3">${pricePerNight.toFixed(2)} CAD per night</h5>
      <div className="booking-inputs border">
        <Calendar listing={listing}
          onCheckInChange={(date) => setCheckIn(date)}
          onCheckOutChange={(date) => setCheckOut(date)}
        />
        <div className="px-2 py-1 d-flex align-items-center my-2">
          <label>Number of guests:</label>
          <input
            className="border-0"
            type="number"
            min={1}
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(parseInt(ev.target.value, 10))}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          className="btn btn-danger my-4 px-4 py-3 rounded-pill w-75"
          onClick={handleReserve}
        >
          Reserve
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Guest Limit Exceeded</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sorry, you exceed the amount of guests the host has allowed 😞
        </Modal.Body>
      </Modal>

      <Modal show={showDateModal} onHide={() => setShowDateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Date Selection Needed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please select dates for your stay 🏠
        </Modal.Body>
      </Modal>

      <div className="mt-4">
        {numberOfNights > 0 && (
          <div className="d-flex flex-row justify-content-between align-items-center px-4">
            <h5>
              {pricePerNight.toFixed(2)} X {numberOfNights} nights
            </h5>
            <h5>${(numberOfNights * pricePerNight.toFixed(2)).toFixed(2)}</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingWidget;
