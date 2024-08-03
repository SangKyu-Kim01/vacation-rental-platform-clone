import React, { useState, useEffect } from "react";
import avatar from "../../assets/images/avatar.jpg";

function ReviewInfo({ listing }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/review/listing/${listing._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
        // Handle error appropriately, e.g., show error message to user
      }
    };

    fetchReviews();
  }, [listing]);

  const renderStars = (rating) => {
    const star = "★";
    return star.repeat(rating);
  };

  return (
    <>
      {/* Reviews */}
      <h4 className="my-3">Guest Reviews</h4>
      <div className="mt-4 d-flex flex-wrap justify-content-between border-bottom pb-3">
        {reviews.map((review, index) => (
          <div
            key={review._id}
            className={`listing-review d-flex flex-row mb-3 ${
              index % 2 === 0 ? "mr-3" : "ml-3"
            }`}
            style={{ width: "calc(50% - 15px)" }}
          >
            {/* Retrieve Users Information */}
            <div>
              <img
                className="rounded-circle"
                src={review.user.imageUrl || avatar}
                alt="profile"
                width="50"
                height="50"
              />
            </div>
            {/* Retrieve Users information by userID --> name city country */}
            <div className="d-flex flex-column ms-4">
              <h6>{review.user.username}</h6>
              <h6>
                {review.user.city}, {review.user.country}{" "}
              </h6>
              {/* Reviews with stars and date */}
              <div className="d-flex align-items-center">
                <span className="me-2">{renderStars(review.rating)}</span>
                <span className="me-2">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {/* Review Text */}
              <span>{review.reviewText}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ReviewInfo;
