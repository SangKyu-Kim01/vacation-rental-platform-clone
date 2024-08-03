import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ onClick, label, to }) => {
  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="px-4 py-3 bg-light rounded"
        style={{ cursor: "pointer" }}
      >
        {label}
      </div>
    );
  } else if (to) {
    return (
      <Link
        to={to}
        className="px-4 py-3 bg-light rounded text-decoration-none text-dark"
      >
        {label}
      </Link>
    );
  }
};

export default MenuItem;
