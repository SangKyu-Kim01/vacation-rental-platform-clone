import React, { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { format, parseISO } from "date-fns";
import axios from 'axios';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../styles/ListingDetails.scss";

function Calendar({ onCheckInChange, onCheckOutChange, listing }) {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [disabledDates, setDisabledDates] = useState([]);

  const calendarRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setOpenDate(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchBookingDates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/${listing._id}`);
        const bookedDates = response.data.map(booking => ({
          start: parseISO(booking.checkInDate),
          end: parseISO(booking.checkOutDate),
        }));
        setDisabledDates(bookedDates.flatMap(d => {
          const range = [];
          let current = new Date(d.start);
          while (current <= d.end) {
            range.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return range;
        }));
      } catch (error) {
        console.error("Failed to fetch booking dates:", error);
      }
    };

    if (listing && listing._id) {
      fetchBookingDates();
    }
  }, [listing]);

  const handleChange = (ranges) => {
    setDate([ranges.selection]);
    onCheckInChange(ranges.selection.startDate);
    onCheckOutChange(ranges.selection.endDate);
  };

  const handleClick = () => {
    setOpenDate((prev) => !prev);
  };

  return (
    <div className="calendar-container d-flex align-items-center">
      <div ref={calendarRef} className="booking-inputs w-100">
        <div className="d-flex flex-row">
          <div className="p-2 d-flex flex-column w-50 border-bottom">
            <label className="mb-1">Check-In:</label>
            <span onClick={handleClick} className="calendar p-1">
              {`${format(date[0].startDate, "MMM dd, yyyy")} `}
            </span>
          </div>
          <div className="p-2 d-flex flex-column border-bottom w-50">
            <label className="mb-1">Check-Out:</label>
            <span onClick={handleClick} className="calendar p-1">
              {` ${format(date[0].endDate, "MMM dd, yyyy")}`}
            </span>
          </div>
        </div>
        {openDate && (
          <DateRange
            className="date-range"
            ranges={date}
            onChange={handleChange}
            direction="horizontal"
            showDateDisplay={true}
            minDate={new Date()}
            disabledDates={disabledDates}
            preventSnapRefocus={true}
            calendarFocus="backwards"
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
