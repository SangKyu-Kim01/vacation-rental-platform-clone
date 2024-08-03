import React from "react";

import { Routes, Route } from "react-router-dom";

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
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/auth-callback" element={<AuthCallBack />} />
      <Route
        path="/search"
        element={
          <Layout>
            <SearchPage />
          </Layout>
        }
      />
      <Route
        path="/listings/:id"
        element={
          <Layout>
            <ListingDetails />
          </Layout>
        }
      />
      <Route path="/listings/gallery/:id" element={<Gallery />} />
      <Route
        path="/account/listings"
        element={
          <Layout>
            <UserListing />
          </Layout>
        }
      />
      <Route
        path="/account/listing/new"
        element={
          <Layout>
            <CreateListing />
          </Layout>
        }
      />
      <Route
        path="/account/listing/update/:id"
        element={
          <Layout>
            <UpdateListing />
          </Layout>
        }
      />
      <Route
        path="/account"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/account/bookings"
        element={
          <Layout>
            <GuestBookings />
          </Layout>
        }
      />
      <Route
        path="/account/messages"
        element={
          <Layout>
            <UserMessage />
          </Layout>
        }
      />
      <Route
        path="/booking"
        element={
          <Layout>
            <Booking />
          </Layout>
        }
      />
      <Route
        path="/contact_host/:id"
        element={
          <Layout>
            <ContactHost />
          </Layout>
        }
      />
      <Route
        path="/payment-details"
        element={
          <Layout>
            <PaymentDetails />
          </Layout>
        }
      />
      <Route
        path="/payment-canceled"
        element={
          <Layout>
            <PaymentCancel />
          </Layout>
        }
      />
      <Route
        path="/admin"
        element={
          <Layout>
            <Admin />
          </Layout>
        }
      />
      <Route
        path="/account/review"
        element={
          <Layout>
            <Review />
          </Layout>
        }
      />
    </Routes>
  );
}

export default Routers;
