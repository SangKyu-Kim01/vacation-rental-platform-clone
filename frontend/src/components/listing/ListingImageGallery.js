import React from "react";
import { Link } from "react-router-dom";
import { TbGridDots } from "react-icons/tb";
import "../../styles/ListingDetails.scss";

function ListingImageGallery({ listing }) {
  const signedUrls = listing?.signedUrls || [];

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Listing images index[0] is the main */}
      <div className="listing-photos d-flex flex-row">
        {/* Main photo */}
        <div className="main-photo p-2">
          <Link to={`/listings/gallery/${listing._id}`}>
            <img
              key={signedUrls[0]}
              src={signedUrls[0]}
              alt=""
              className="listing-photo"
            />
          </Link>
          <span className=""></span>
        </div>

        {/* Other Photo */}
        <div className="other-photos border-0 p-2">
          {signedUrls.slice(1, 5).map((url, index) => (
            <Link to={`/listings/gallery/${listing._id}`}>
              <img
                key={url}
                src={url}
                alt=""
                className="listing-photo other-photo"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListingImageGallery;
