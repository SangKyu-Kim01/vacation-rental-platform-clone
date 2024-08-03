import React, { useState } from "react";
import Pin from "../listing/Pin";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import "../../styles/ListingDetails.scss";

function ListingGoogleMap({ listings, containerStyle }) {
  const key = process.env.REACT_APP_GOOGLE_MAP_KEY;
  const mapId = process.env.REACT_APP_MAP_ID;
  const [center, setCenter] = useState({ lat: 45.501689, lng: -73.567256 });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        alert(error);
      }
    );
  } else {
  }

  const { isLoaded } = useJsApiLoader({
    id: mapId,
    googleMapsApiKey: key,
  });

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        options={{ mapId: mapId }}
        zoom={10}
      >
        {listings.map((listing) => (
          <Pin listing={listing} key={listing._id} />
        ))}
      </GoogleMap>
    )
  );
}

export default ListingGoogleMap;
