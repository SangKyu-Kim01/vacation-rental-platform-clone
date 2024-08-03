import React, { useState, useEffect } from "react";
import avatar from "../../assets/images/avatar.jpg";
import { useGetMyUser } from "../../api/UserApi";
import { FiCalendar } from "react-icons/fi";
import "../../styles/ListingDetails.scss";

import bedroomPhoto from "../../assets/images/Bedroom.jpg";

function ListingInfo({ listing }) {
  // const [avgRating, setAvgRating] = useState(0);
  // const [reviews, setReviews] = useState([]);
  const [userPicture, setUserPicture] = useState(null);
  const [username, setUsername] = useState(null);
  const { currentUser, isLoading } = useGetMyUser();

  useEffect(() => {
    if (currentUser) {
      setUserPicture(currentUser.imageUrl);
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  if (!listing || isLoading) {
    return <div>Loading...</div>;
  }

  const {
    type,
    city,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    description,
    // averageRate,
  } = listing;

  return (
    <div>
      <h3 className="fw-bold mt-4">
        {type} in {city}, {country}
      </h3>

      {/* Max Guest | Bedroom | Bed | Bathroom */}
      <div>
        <span className="d-flex align-items-center gap-1">
          {guestCount} Guests | {bedroomCount} Bedrooms | {bedCount} Beds |{" "}
          {bathroomCount} Baths
        </span>
      </div>
      {/* Average Ratings */}
      <div className="border-bottom pb-3">
        {/* <span className="d-flex align-items-center gap-1">
          <i className="bi bi-star-fill"></i>
          {avgRating === 0 ? null : avgRating}
          {totalRating === 0 ? (
            "Not yet rated"
          ) : (
            <span>| ({reviews.length})</span>
          )}
        </span> */}
      </div>
      {/* Host */}
      {/* ToDo Retrieve Users Name and Photo */}
      <div className="mt-3 d-flex flex-row border-bottom pb-3">
        <img
          className="rounded-circle"
          src={listing.host.imageUrl || avatar}
          alt="profile"
          width="40"
          height="40"
        />
        <h6 className="mx-3">Hosted By {listing.host.username}</h6>
      </div>

      {/* Extra Information */}
      <div className="mt-3 d-flex flex-row border-bottom pb-3">
        <h5>
          <FiCalendar /> &nbsp;&nbsp; Free cancellation for 48 hours
        </h5>
        {/* ToDo: */}
        {/* Put 1 feature of the place */}
        {/* Put 1 feature about the user */}
      </div>

      {/* Description */}

      <div className="mt-3 g-2 border-bottom pb-3 px-4">{description}</div>

      {/* Bedroom*/}
      {/* ToDo: add type of bed: king, queen, double */}
      {/* <div className="mt-3 d-flex flex-column border-bottom pb-3">
        <h4 className="mb-3">Where you'll sleep</h4>
        <div className="bedroom-photo">
          <img src={bedroomPhoto} alt="" className="listing-photo" />
        </div>
        <h6 className="pt-3">Bedroom</h6>
        <p>{bedCount} Queen size bed</p>
      </div> */}
    </div>
  );
}

export default ListingInfo;
