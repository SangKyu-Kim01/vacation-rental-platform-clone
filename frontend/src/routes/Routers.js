import React from "react";

import { Routes, Route, Outlet } from "react-router-dom";

import Home from "../pages/Home";
import ListingDetails from "../pages/ListingDetails";
import CreateListing from "../pages/CreateListing";
import UpdateListing from "../pages/UpdateListing";
import Profile from "../pages/Profile";
import GuestBookings from "../pages/GuestBookings";
import UserListing from "../pages/UserListing";
import Booking from "../pages/Booking";
import Layout from "../components/layout/Layout";
import AuthCallBack from "../pages/AuthCallBack";
import Gallery from "../components/listing/Gallery";
import ContactHost from "../pages/HostMessage";
import UserMessage from "../pages/UserMessage";
import SearchPage from "../pages/SearchPage";
import PaymentDetails from "../pages/PaymentDetails";
import PaymentCancel from "../pages/PaymentCancel";
import Admin from "../pages/Admin";
import Review from "../pages/Review";

function Routers() {
  return (
    <Routes>
      {/* Route lists that do not need to be wrapped in Layout */}
      <Route path="/auth-callback" element={<AuthCallBack />} />
      <Route path="/listings/gallery/:id" element={<Gallery />} />

      {/* Route lists that need to be wrapped in Layout */}
      <Route
        element={
          <Layout>
            <Outlet /> {/* Outlet is used to render nested routes */}
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/listings/:id" element={<ListingDetails />} />

        {/* Account-related routes */}
        <Route path="/account/listings" element={<UserListing />} />
        <Route path="/account/listing/new" element={<CreateListing />} />
        <Route path="/account/listing/update/:id" element={<UpdateListing />} />
        <Route path="/account/bookings" element={<GuestBookings />} />
        <Route path="/account/messages" element={<UserMessage />} />
        <Route path="/account/review" element={<Review />} />
        <Route path="/account" element={<Profile />} />

        <Route path="/booking" element={<Booking />} />
        <Route path="/contact_host/:id" element={<ContactHost />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/payment-canceled" element={<PaymentCancel />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default Routers;
