import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillPersonFill, BsCalendarFill } from "react-icons/bs";
import { FaHome } from "react-icons/fa";

function ProfileNav() {
  const { pathname } = useLocation();
  let subpage = pathname.split("/")[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClasses(type = null) {
    let classes = "nav-link py-3 px-4 rounded-pill mt-4";
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-light";
    }
    return classes;
  }

  return (
    <nav className="d-flex justify-content-center my-5 rounded-pill">
      <Link className={linkClasses("profile")} to="/account">
        <BsFillPersonFill className="me-2" />
        My Profile
      </Link>
      <Link className={linkClasses("bookings")} to="/account/bookings">
        <BsCalendarFill className="me-2" />
        My Bookings
      </Link>
      <Link className={linkClasses("listings")} to="/account/listings">
        <FaHome className="me-2" />
        My Accommodations
      </Link>
    </nav>
  );
}

export default ProfileNav;
