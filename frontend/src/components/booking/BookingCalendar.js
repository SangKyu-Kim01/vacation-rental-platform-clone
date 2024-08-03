import React, { useState } from "react";
import Calendar from "@demark-pro/react-booking-calendar";
import { isWithinInterval } from "date-fns";

const reserved = [
  {
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 4, 29),
  },
];

function BookingCalendar() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [showCheckInMessage, setShowCheckInMessage] = useState(true);

  const handleChange = (e) => {
    setSelectedDates(e);
    setShowCheckInMessage(false);
  };

  const isDateReserved = (date) => {
    return reserved.some((r) =>
      isWithinInterval(date, { start: r.startDate, end: r.endDate })
    );
  };

  return (
    <div className="mt-4 border-bottom pb-3">
      {showCheckInMessage && (
        <div className="message mb-3">
          <h4>Select check-in date</h4>
          <span>Add your travel dates for exact pricing</span>
        </div>
      )}
      <Calendar
        selected={selectedDates}
        onChange={handleChange}
        onOverbook={(e, err) => alert(err)}
        components={{
          DayCellFooter: ({ innerProps }) => <div {...innerProps}></div>,
        }}
        disabled={(date, state) => !state.isSameMonth || isDateReserved(date)}
        reserved={reserved}
        variant="events"
        dateFnsOptions={{ weekStartsOn: 1 }}
        range={true}
      />
    </div>
  );
}

export default BookingCalendar;
