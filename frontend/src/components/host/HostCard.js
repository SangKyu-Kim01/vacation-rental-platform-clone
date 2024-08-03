import React from "react";
import avatar from "../../assets/images/avatar.jpg";
import "../../styles/ListingDetails.scss";

function HostCard({ listing }) {
  return (
    <div className="d-flex flex-row shadow w-75 p-2 mx-5 mt-5 mb-2 hostcard-container bg-white">
      <div className="d-flex flex-column w-50 justify-content-center align-items-center">
        <img
          className="rounded-circle m-4 text-center"
          src={listing.host.imageUrl || avatar}
          alt="profile"
          width="100"
          height="100"
        />
        <h6 className="mx-3 text-center">{listing.host.username}</h6>
      </div>

      {/* Retrieve User Rating Information */}
      <div className="d-flex flex-column w-50 p-3">
        <div className="border-bottom p-2">
          <h6>200</h6>
          <span>Reviews</span>
        </div>
        <div className="border-bottom p-2">
          <h6>
            4.8 <i className="bi bi-star-fill"></i>
          </h6>
          <span>Rating</span>
        </div>
        <div className="border-bottom p-2">
          <h6>3</h6>
          <span>Years Hosting</span>
        </div>
      </div>
    </div>
  );
}

export default HostCard;
