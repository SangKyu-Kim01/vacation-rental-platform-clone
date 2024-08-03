import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import avatar from "../assets/images/avatar.jpg";
import "../styles/Chat.scss";

function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  // Static
  const contacts = [
    {
      name: "Mark",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
    {
      name: "Mary",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
    {
      name: "John",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
    {
      name: "Jane",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
    {
      name: "Greg",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
    {
      name: "Karl",
      city: "Montreal",
      avatar: avatar,
      message: "This is the last message (trim it)",
      tripStatus: "Trip completed | Apr 22 - 24, 2024",
    },
  ];

  const messages = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "7:25pm",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "7:25pm",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "7:25pm",
    },
  ];

  return (
    <div className="chat border ">
      <Container fluid className="">
        <Row>
          <Col lg={3}>
            <Row>
              <Col className=" fw-bold border p-4">
                <h4>Messages</h4>
              </Col>
            </Row>
            <Row>
              <Col className="messages">
                {contacts?.map((contact, index) => (
                  <div
                    key={index}
                    className={`d-flex flex-row border-bottom ${
                      selectedContact === contact ? "selected-contact" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={contact.avatar}
                        width="60"
                        height="60"
                        className="rounded-circle "
                      />
                    </div>
                    <div className="d-flex flex-column p-2">
                      <span className="fw-bold">{contact.name}</span>
                      <span>{messages.text}</span>
                      <span>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      </span>
                      <span className="">
                        Trip Completed Apr 23 - Apr 25, 2024
                      </span>
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </Col>
          <Col sm={9}>
            {selectedContact && (
              <Row>
                <Col className="fw-bold border p-4">
                  <h4>{selectedContact.name}</h4>
                </Col>
              </Row>
            )}
            {selectedContact && (
              <Row>
                <Col className="d-flex flex-column justify-content-center align-items-center center">
                  {messages?.map((message) => (
                    <div className="conversation-box rounded-pill d-flex flex-row justify-content-centers w-50 p-3 mt-2">
                      <div className="d-flex align-items-center">
                        <img
                          src={selectedContact.avatar}
                          width="60"
                          height="60"
                          className="rounded-circle "
                        />
                      </div>

                      <div className="d-flex flex-column">
                        <span className="fw-bold">
                          {selectedContact.name}
                          <span className="">{message.time}</span>
                        </span>
                        <span>{message.text}</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <div className="input d-flex justify-content-center">
                  <input
                    type="text"
                    className="p-2 rounded-pill w-50 "
                    placeholder="Type your message here..."
                  />
                </div>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Chat;
