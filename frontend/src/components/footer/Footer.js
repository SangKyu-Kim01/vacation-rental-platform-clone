import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <Container className="mt-5">
      <div className="fixed-bottom bg-white shadow-sm w-100 p-2 ">
        <div className="d-flex align-items-center justify-content-center">
          @2024 Airbnb(Clone).FSD10 | Privacy | Terms | Sitemap
        </div>
      </div>
    </Container>
  );
}

export default Footer;
