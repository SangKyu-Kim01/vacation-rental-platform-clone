import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import { FaTimes } from "react-icons/fa";
import "../../styles/ImageGallery.scss";

function Gallery() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/listing/${id}`
        );

        setListing(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return <div>Loading...</div>;
  }

  const titles = [
    "House Front-View",
    "Bedroom 1",
    "Patio",
    "Solarium",
    "Living Room",
  ];

  const images = listing.signedUrls.map((url, index) => ({
    original: url,
    thumbnail: url,
    originalClass: "pb-3",
    thumbnailClass: "",
    originalHeight: 600,
    originalWidth: 1000,
    originalTitle: titles[index % titles.length],
    thumbnailTitle: titles[index % titles.length],
  }));

  return (
    <div className="bg-black">
      <h1 className="text-center text-white p-5">
        {listing.title} Image Gallery
      </h1>
      <div className="mt-5">
        <ImageGallery items={images} />
      </div>
      <div className="text-center mt-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-light py-2 px-4 my-3"
        >
          <FaTimes className="mr-1" /> Close
        </button>
      </div>
    </div>
  );
}

export default Gallery;
