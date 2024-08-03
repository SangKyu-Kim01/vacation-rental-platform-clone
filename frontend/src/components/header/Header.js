import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../../assets/images/logo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import avatar from "../../assets/images/avatar.jpg";

function Header() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <Container>
      <div className="fixed-top bg-white shadow-sm w-100 p-3">
        <nav className="d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link
              to={"/home"}
              onClick={() => (window.location.href = "/home")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={logo}
                className="pointer"
                width="100"
                alt="logo"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>
          <Search />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div
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
              onClick={() => loginWithRedirect()}
              style={{ cursor: "pointer" }}
            >
              <AiOutlineMenu />
              <img
                className="rounded-circle"
                src={avatar}
                alt="profile"
                width="30"
                height="30"
              />
            </div>
          )}
        </nav>
      </div>
    </Container>
  );
}

export default Header;
