import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AiOutlineMenu } from "react-icons/ai";
import avatar from "../../assets/images/avatar.jpg";
import MenuItem from "./MenuItem";
import { useGetMyUser } from "../../api/UserApi";
import "../../styles/UserMenu.scss";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout, user } = useAuth0();

  const { currentUser, isLoading } = useGetMyUser();

  useEffect(() => {
    if (currentUser && currentUser.imageUrl) {
      user.picture = currentUser.imageUrl;
    }
    if (currentUser && currentUser.username) {
      user.username = currentUser.username;
    }

    // Check admin status when currentUser changes
    const checkAdminStatus = async () => {
      try {
        setIsAdmin(currentUser && currentUser.role === "Admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [currentUser, user]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="Menu-container position-relative">
      <div className="Menu-box d-flex flex-row align-items-center gap-3">
        <div className="slogan p-2 rounded-pill">Airbnb your home</div>
        <div
          ref={menuRef}
          className="
            p-2
            border
            border-secondary
            d-flex 
            flex-row 
            align-items-center 
            gap-3 
            rounded-pill 
            shadow-sm
          "
          onClick={toggleMenu}
          style={{ cursor: "pointer" }}
        >
          <AiOutlineMenu />
          {/*Retrieve User profile picture */}
          <img
            className="user-avatar rounded-circle"
            src={user.picture || avatar}
            alt="profile"
            width="30"
            height="30"
          />
          {/* Retrieve from Auth0 username */}
          <span className="current-user">{user.username}</span>
        </div>
      </div>

      {isOpen && (
        <div
          className="
          
            position-absolute 
            rounded 
            shadow-md
            w-75
            overflow-hidden 
            end-0 
            border-bottom
          "
          style={{ backgroundColor: "white" }}
        >
          <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
            <MenuItem label="Profile" to="/account" />
            <MenuItem label="Bookings" to="/account/bookings" />
            {/* ToDo: Create router for account messages */}
            <MenuItem label="Messages" to="/account/messages" />
            <MenuItem label="Reviews" to="/account/review" />
            <MenuItem label="Become a Host" to="/account/listing/new" />
            <MenuItem label="Accomodations" to="/account/listings" />
            {/* Render only if admin */}
            {isAdmin && <MenuItem label="Admin" to="/admin" />}
            <hr />
            <MenuItem
              label="Logout"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
