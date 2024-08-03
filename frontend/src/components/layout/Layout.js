import React from "react";

import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function Layout({ children }) {
  return (
    <div style={{ paddingTop: "80px" }}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
