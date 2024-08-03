import React, { useEffect, useState } from "react";
import ReviewCard from "../components/review/ReviewCard";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

function Review() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [bookings, setBookings] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await axios.get(
          `${API_BASE_URL}/booking/my/bookings`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        if (error.response) {
          toast.error(
            `Failed to fetch bookings: ${error.response.data.message}`
          );
        } else if (error.request) {
          toast.error("Failed to fetch bookings: No response from the server");
        } else {
          toast.error("Error in booking fetch setup: " + error.message);
        }
      }
    };

    fetchBookings();
  }, [getAccessTokenSilently]);

  // Filtering the Bookings
  const pastBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Expired"
  );

  return (
    <>
      <div className="profile">
        <h1 className="text-center">My Reviews</h1>
      </div>

      {pastBookings.length > 0 && (
        <Container className="shadow border p-4">
          <Row className="mb-4" style={{ margin: "50px 0 10px 30px" }}>
            {pastBookings.map((booking) => (
              <ReviewCard key={booking._id} booking={booking} />
            ))}
          </Row>
        </Container>
      )}
    </>
  );
}

export default Review;
