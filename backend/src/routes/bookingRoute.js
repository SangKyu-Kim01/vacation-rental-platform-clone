const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser"); 
const rawBodyMiddleware = bodyParser.raw({type: 'application/json'});
const { jwtCheck, jwtParse } = require("../middleware/auth");

/* Controller */
const bookingController = require("../controllers/bookingController");

/* Make Payment */
router.post("/payment", express.json(), bookingController.makePayment);

/* Get Payment Details */
router.get("/payment-details", express.json(), bookingController.getPaymentDetails);

/* Make Booking */
router.post("/book", rawBodyMiddleware, bookingController.makeBooking);

/* Get User's Bookings */
router.get("/my/bookings", express.json(), jwtCheck, jwtParse, bookingController.getMyBookings);

/* Refund the customer and cancel booking*/
router.post("/cancel/:id", express.json(), bookingController.cancelBooking);

/* Get All Bookings */
router.get("/:id", express.json(), bookingController.getBookingsByListingId);


module.exports = router;
