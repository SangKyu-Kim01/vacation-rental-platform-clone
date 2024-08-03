import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchContext } from "../../auth/SearchContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Search.scss";
function Search() {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState(search.destination);
  const [checkIn, setCheckIn] = useState(new Date(search.checkIn));
  const [checkOut, setCheckOut] = useState(new Date(search.checkOut));
  const [guestCount, setGuestCount] = useState(search.guestCount);

  const handleSubmit = (event) => {
    event.preventDefault();
    search.saveSearchValues(destination, checkIn, checkOut, guestCount);
    navigate("/search");
  };
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      className="searchbar d-flex gap-2 border border-gray-300 rounded-pill py-1 px-4 shadow align-items-center"
      onSubmit={handleSubmit}
    >
      <div className="d-flex flex-column p-1">
        <span>Where</span>
        <input
          type="text"
          placeholder="Anywhere"
          value={destination || ""}
          onChange={(e) => setDestination(e.target.value)}
          className="border-0 search-input w-100 p-1"
        />
      </div>
      <div>
        <span>Check-in</span>
        <DatePicker
          placeholderText="Add Date"
          className="w-75 bg-white p-1 border-0 checkin"
          wrapperClassName="min-w-full"
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div>
        <span>Check-out</span>
        <DatePicker
          placeholderText="Add Date"
          className="w-75 bg-white p-1 border-0 checkout"
          wrapperClassName="min-w-full"
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>

      <div className="d-flex flex-column">
        {" "}
        <span>Add Guests</span>
        <input
          type="number"
          min={1}
          placeholder="Add Guests"
          value={guestCount || ""}
          onChange={(e) => setGuestCount(parseInt(e.target.value))}
          className="border-0 guest p-1 w-100"
        />
      </div>

      <button
        className="rounded-pill text-white"
        type="submit"
        style={{
          backgroundColor: "#FF5A5F",
          border: "none",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          padding: "10px 10px",
        }}
      >
        <BiSearch size={18} />
      </button>
    </form>
  );
}

export default Search;
