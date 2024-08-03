import React from "react";
import { facilities } from "../../assets/data/data";

function Amenities({ listing }) {
  const amenities = listing?.amenities || [];

  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-bottom pb-3">
      <h4 className="mb-3">What this place offers</h4>
      <ul className="list-unstyled fs-5">
        {amenities.flatMap((amenity, index) =>
          amenity.split(",").map((item, idx) => {
            const matchedFacility = facilities.find(
              (facility) => facility.name.trim() === item.trim()
            );
            if (!matchedFacility) {
              return null; // Skip if no matching facility found
            }
            return (
              <li key={index + "-" + idx}>
                {matchedFacility.icon} {item.trim()}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default Amenities;
