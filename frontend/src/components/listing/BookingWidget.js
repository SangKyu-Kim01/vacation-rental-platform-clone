import React, { useState } from "react";
import { Link } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
import "../../styles/ListingDetails.scss";

function BookingWidget({ listing }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const { pricePerNight } = listing;

  const price = parseFloat(pricePerNight["$numberDecimal"]);

  return (
    <div className="booking-info border bg-white mt-3 p-3 shadow h-50 w-75 mx-5">
      <h5>${price.toFixed(2)} CAD night</h5>
      <div className="booking-inputs border mt-2">
        <div className="d-flex flex-row">
          <div className="p-3 border-bottom">
            <label>Check in:</label>
            <input
              className="border-0"
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="p-3 border-bottom">
            <label>Check out: </label>
            <input
              className="border-0"
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="p-3">
          <label>Number of guests:</label>
          <input
            className="border-0"
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-danger mt-4 px-4 py-3 rounded-pill w-75">
          <Link className="text-decoration-none text-white" to="/booking">
            Reserve
          </Link>
        </button>
      </div>

      <div className="mt-4">
        {numberOfNights > 0 && (
          <div className="d-flex flex-row justify-content-between align-items-center px-4">
            <h5>
              {price.toFixed(2)} X {numberOfNights} nights
            </h5>
            <h5>${(numberOfNights * price.toFixed(2)).toFixed(2)}</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingWidget;
