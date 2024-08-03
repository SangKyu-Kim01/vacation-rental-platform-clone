import { Card, Container, Row } from "react-bootstrap";
export const CategoryCard = ({ label, Icon }) => (
  <Card
    className="rounded-circle border-0 shadow-sm"
    style={{
      width: "80px",
      height: "80px",
      cursor: "pointer",
    }}
  >
    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
      <div className="text-center mb-3">
        <Icon size={20} />
      </div>
      <Card.Title
        className="text-center fw-medium"
        style={{ fontSize: "10px" }}
      >
        {label}
      </Card.Title>
    </Card.Body>
  </Card>
);
