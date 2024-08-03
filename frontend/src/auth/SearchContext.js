import React, { useContext, useState } from "react";

const SearchContext = React.createContext(undefined);
export const SearchContextProvider = ({ children }) => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(
    () => new Date(new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState(
    () => new Date(new Date().toISOString())
  );
  const [guestCount, setGuestCount] = useState(() => parseInt("1"));

  const saveSearchValues = (destination, checkIn, checkOut, guestCount) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setGuestCount(guestCount);
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        guestCount,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context;
};
