import React, { useState } from "react";
import LisitngPhotos from "./LisitngPhotos";
import { FaCircle } from "react-icons/fa";

function ListingPhotoGallery({ listing }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="position-absolute inset-0 bg-dark text-white">
        <div className="bg-dark p-4 gap-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fs-3 mr-4">Photos of {listing.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="btn btn-light d-flex align-items-center gap-1"
            >
              <FaCircle className="me-1" />
              Close photos
            </button>
          </div>
          {showAllPhotos &&
            listing?.photo?.length > 0 &&
            listing.photo.map((photo, index) => (
              <div key={index}>
                <LisitngPhotos src={photo} alt="Host listing photos" />
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default ListingPhotoGallery;
