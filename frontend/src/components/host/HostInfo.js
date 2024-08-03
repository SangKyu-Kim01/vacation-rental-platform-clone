import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/ListingDetails.scss";
import HostCard from "./HostCard";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

function HostInfo({ listing }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const messageHost = async () => {
    const accessToken = await getAccessTokenSilently();
    try {
      const response = await axios.post(
        `${BASE_URL}/chat`,
        {
          receiverId: listing.host._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      navigate(`/contact_host/${id}`);
    } catch (error) {
      console.error("Failed to add chat:", error);
      // Handle error
    }
  };

  return (
    <div className="mt-4 pb-3">
      <h4>Meet your Host</h4>

      <Container className="host-container pb-4">
        <Row className="">
          <Col lg="5" className="">
            {listing && listing.host && <HostCard listing={listing} />}
            {/* Information about the Host */}
            {/* To Delete */}
          </Col>

          <Col>
            <div className="d-flex flex-column mt-4">
              <h5>About {listing.host.username}</h5>
              <span>Born in the 90's </span>
              <span>Lives in Montreal, Qc, Canada</span>
            </div>
            <div className="d-flex flex-column">
              <h6 className="mt-4 mb-3">Host Details</h6>

              <span>Response rate: 100%</span>
              <span>Responds within an hour</span>

              <Button
                onClick={messageHost}
                className="message-btn btn btn-dark px-4 py-3 mt-4 w-25"
              >
                Message Host
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HostInfo;
