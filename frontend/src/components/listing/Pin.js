import React, { useState, useEffect } from "react";
import { MarkerF, InfoWindow } from "@react-google-maps/api";
import { setKey, fromAddress } from "react-geocode";
import { Link } from "react-router-dom";
const { useNavigate } = require("react-router-dom");
function Pin({ listing }) {
  const navigate = useNavigate();
  const key = process.env.REACT_APP_GOOGLE_MAP_KEY;
  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const handleMarkerClick = () => {
    setIsOpen(true);
  };
  const address = `${listing.street},${listing.city},${listing.country}`;
  setKey(key);
  useEffect(() => {
    const getAddressLatLng = async () => {
      try {
        const { results } = await fromAddress(address);
        const { lat, lng } = results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      } catch (error) {
        console.error("Error getting address LatLng:", error);
      }
    };
    getAddressLatLng();
  }, [address]);
  const position =
    lat && lng
      ? { lat, lng }
      : {
          lat: 45.501689,
          lng: -73.567256,
        };

  return (
    <MarkerF position={position} onClick={handleMarkerClick}>
      {isOpen && (
        <InfoWindow
          onCloseClick={() => {
            setIsOpen(false);
          }}
        >
          <div className="popup-container">
            <img
              key={listing.signedUrls[0]}
              src={listing.signedUrls[0]}
              alt=""
            />
            <div className="text-container">
              <Link to={`/listings/${listing._id}`}>
                {listing.pricePerNight["$numberDecimal"]} PerNight
              </Link>
            </div>
          </div>
        </InfoWindow>
      )}
    </MarkerF>
  );
}

export default Pin;
