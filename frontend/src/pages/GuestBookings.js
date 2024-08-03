import React, { useEffect, useState } from "react";
import ProfileNav from "../shared/ProfileNav";
import BookingCard from "../components/booking/BookingCard";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

function GuestBookings() {
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
  const upcomingBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Confirmed"
  );
  const pastBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Expired"
  );
  const canceledBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Canceled"
  );

  return (
    <>
      <div className="profile">
        <ProfileNav />
        <h1 className="text-center">My Bookings</h1>
      </div>

      {upcomingBookings.length > 0 ? (
        <Container className="shadow border p-4">
          <h3 className="mb-4">Upcoming Rentals</h3>
          <Row>
            {upcomingBookings.map((booking) => (
              <Col lg="2" key={booking._id}>
                <BookingCard booking={booking} />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <Container className="shadow border p-4 text-center">
          <h3 className="mb-4">Upcoming Rentals</h3>
          <p>All your amazing stays will display here ❤️</p>
        </Container>
      )}

      {pastBookings.length > 0 && (
        <Container className="shadow border p-4">
          <h3 className="mb-4">Where you've been</h3>
          <Row>
            {pastBookings.map((booking) => (
              <Col lg="2" key={booking._id}>
                <BookingCard booking={booking} />
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {canceledBookings.length > 0 && (
        <Container className="shadow border p-4">
          <h3 className="mb-4">Cancelled Trips</h3>
          <Row>
            {canceledBookings.map((booking) => (
              <Col lg="2" key={booking._id}>
                <BookingCard booking={booking} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </>
  );
}

export default GuestBookings;
