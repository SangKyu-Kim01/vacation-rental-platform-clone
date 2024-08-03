import React, { useEffect, useState } from "react";
import ProfileNav from "../shared/ProfileNav";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useGetMyUser } from "../api/UserApi";
import "../styles/confirmationToast.scss";

function UserListing() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const { currentUser } = useGetMyUser();

  useEffect(() => {
    const fetchListings = async (accessToken) => {
      try {
        const userId = currentUser ? currentUser._id : null;
        if (!userId) {
          toast.error("Please log in to view your listings", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/listing`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", response.data);

        // Filter listings based on the current user's ID
        const userListing = response.data.filter(
          (listing) => listing.host._id === userId
        );
        setListings(userListing);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    if (currentUser) {
      fetchListings();
    }
  }, [currentUser, API_BASE_URL]);

  const handleDeleteListing = async (id) => {
    toast.info(
      <div className="confirmation-toast">
        <div className="message">
          Are you sure you want to delete this listing?
        </div>
        <div className="button-container">
          <button
            className="confirm-button"
            onClick={() => {
              deleteListing(id);
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button className="cancel-button" onClick={() => toast.dismiss()}>
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const deleteListing = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/listing/${id}`);
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== id)
      );
      // Display success message using toast
      toast.success("Listing deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const handleUpdateListing = async (id) => {
    navigate(`/account/listing/update/${id}`);
  };

  return (
    <>
      <ProfileNav />
      <div className="container mt-5">
        <h1 className="text-center" style={{ color: "#24355A" }}>
          My Accomodations
        </h1>
        <div className="adminPanel">
          <div className="adminContainer">
            <div className="adminTable">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>City</th>
                    <th>Province</th>
                    <th>Country</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing._id}>
                      <td>
                        <Link
                          to={`/listings/${listing._id}`}
                          style={{ cursor: "pointer" }}
                          className="text-decoration-none"
                        >
                          <img
                            src={listing.signedUrls[0]}
                            alt={listing.title}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      </td>
                      <td>{listing.title}</td>
                      <td>{listing.city}</td>
                      <td>{listing.province}</td>
                      <td>{listing.country}</td>
                      <td>
                        $
                        {parseFloat(
                          listing.pricePerNight["$numberDecimal"]
                        ).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleUpdateListing(listing._id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => handleDeleteListing(listing._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserListing;
