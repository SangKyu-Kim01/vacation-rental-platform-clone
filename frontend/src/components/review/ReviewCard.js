import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/Card.scss";
import "../../styles/admin.css";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useGetMyUser } from "../../api/UserApi";

function ReviewCard({ booking }) {
  const { signedUrls, type, city, _id } = booking.listing;
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { getAccessTokenSilently } = useAuth0();
  const { currentUser, isLoading } = useGetMyUser();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShowWriteModal = () => setShowWriteModal(true);
  const handleCloseWriteModal = () => setShowWriteModal(false);

  const handleShowEditModal = (reviewId, reviewText, rating) => {
    setSelectedReviewId(reviewId);
    setReviewText(reviewText);
    setRating(rating);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedReviewId(null);
    setReviewText("");
    setRating("");
    setShowEditModal(false);
  };

  const handleSaveWriteModal = async (event) => {
    event.preventDefault();

    if (!reviewText || !rating) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/review/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing: booking.listing._id,
          user: booking.user._id,
          rating,
          reviewText,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        handleCloseWriteModal();
        toast.success("Review created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Failed to create review:", response.statusText);
        toast.error("Failed to create review. Please try again.");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Failed to create review. Please try again.");
    }

    handleCloseWriteModal();
  };

  const handleSaveEditModal = async () => {
    if (!reviewText || !rating) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${API_BASE_URL}/review/${selectedReviewId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            reviewText,
          }),
        }
      );

      if (response.ok) {
        console.log("Review updated successfully");
        handleCloseEditModal();
        toast.success("Review updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Failed to update review:", response.statusText);
        toast.error("Failed to update review. Please try again.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    }
  };

  const fetchReviews = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/review`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [API_BASE_URL, getAccessTokenSilently]);

  const handleDeleteClick = async (reviewId) => {
    try {
      console.log("Before deleting review:", reviewId);
      toast.info(
        <div className="confirmation-toast">
          <div className="message">
            Are you sure you want to delete this review?
          </div>
          <div className="button-container">
            <button
              className="confirm-button"
              onClick={async () => {
                try {
                  const accessToken = await getAccessTokenSilently();
                  const response = await fetch(
                    `${API_BASE_URL}/review/${reviewId}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );

                  console.log("After deleting review:", reviewId);

                  if (response.ok) {
                    toast.success("Review deleted successfully");
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  } else {
                    console.error(
                      "Failed to delete review:",
                      response.statusText
                    );
                    toast.error("Failed to delete review. Please try again.");
                  }
                } catch (error) {
                  console.error("Error deleting review:", error);
                  toast.error("Failed to delete review. Please try again.");
                }
              }}
            >
              Yes
            </button>
            <button className="cancel-button" onClick={() => toast.dismiss()}>
              No
            </button>
          </div>
        </div>,
        { autoClose: false, onClose: () => {} } // Provide an empty onClose function
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const renderStars = (rating) => {
    const star = "★";
    return star.repeat(rating);
  };

  return (
    <div className="d-flex flex-row mb-4">
      <Link
        to={`/listings/${_id}`}
        style={{ cursor: "pointer" }}
        className="text-decoration-none"
      >
        <Card className="border-0 shadow mr-4 mb-4">
          <img
            src={signedUrls[0]}
            alt=""
            className="booking_img"
            style={{ height: "125px", width: "200px" }}
          />
        </Card>
      </Link>
      <div
        className="d-flex flex-column"
        style={{ marginLeft: "50px", width: "350px" }}
      >
        <h6
          className="booking_location d-flex text-dark text-opacity-75"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {type} in {city}
        </h6>
        <span
          className="text-info text-dark text-opacity-75"
          style={{ fontSize: "15px" }}
        >
          Hosted By {booking.listing.host?.username}
        </span>
        <span
          className="text-info text-dark text-opacity-75"
          style={{ fontSize: "15px", marginBottom: "5px" }}
        >
          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
        </span>
        {reviews.filter(
          (review) =>
            review.listing._id === booking.listing._id &&
            review.user._id === currentUser._id
        ).length === 0 && (
          <Button
            variant="dark"
            className="mt-2"
            style={{ width: "150px" }}
            onClick={handleShowWriteModal}
          >
            Write a Review
          </Button>
        )}
      </div>

      {reviews
        .filter(
          (review) =>
            review.listing._id === booking.listing._id &&
            review.user._id === currentUser._id
        )
        .map((review) => (
          <div
            key={review._id}
            className="d-flex flex-column"
            style={{ marginLeft: "50px", width: "500px" }}
          >
            <h6
              className="booking_location d-flex text-dark text-opacity-75"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Review for {booking.listing.host?.username}
            </h6>
            <div>
              <span
                className="text-info text-dark text-opacity-75"
                style={{ fontSize: "15px" }}
              >
                Review: {review.reviewText}
              </span>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <span
                className="text-info text-dark text-opacity-75"
                style={{ fontSize: "15px" }}
              >
                Rating: {renderStars(review.rating)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <Button
                variant="dark"
                className="mt-2"
                style={{ width: "80px" }}
                onClick={() =>
                  handleShowEditModal(
                    review._id,
                    review.reviewText,
                    review.rating
                  )
                }
              >
                Edit
              </Button>
              <Button
                variant="dark"
                className="mt-2"
                style={{ width: "80px" }}
                onClick={() => handleDeleteClick(review._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

      <Modal show={showWriteModal} onHide={handleCloseWriteModal}>
        <Modal.Header
          closeButton
          style={{ borderBottom: "none", margin: "10px 20px 0 20px" }}
        >
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="box" style={{ margin: "0 20px" }}>
            <label htmlFor="reviewText" style={{ marginBottom: "0.5rem" }}>
              Review:
            </label>
            <textarea
              className="form-control"
              id="reviewText"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ marginBottom: "0.5rem" }}
            />
          </div>

          <div className="box" style={{ margin: "0 20px" }}>
            <label htmlFor="rating" style={{ marginBottom: "0.5rem" }}>
              Rating:
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option selected>Select the rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", margin: "0 20px 10px 0" }}>
          <Button variant="secondary" onClick={handleCloseWriteModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveWriteModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header
          closeButton
          style={{ borderBottom: "none", margin: "10px 20px 0 20px" }}
        >
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="box" style={{ margin: "0 20px" }}>
            <label htmlFor="reviewText" style={{ marginBottom: "0.5rem" }}>
              Review:
            </label>
            <textarea
              className="form-control"
              id="reviewText"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ marginBottom: "0.5rem" }}
            />
          </div>

          <div className="box" style={{ margin: "0 20px" }}>
            <label htmlFor="rating" style={{ marginBottom: "0.5rem" }}>
              Rating:
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", margin: "0 20px 10px 0" }}>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewCard;
