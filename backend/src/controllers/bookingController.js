const Booking = require("../models/booking");

require("dotenv").config();

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const redirectUrl = process.env.REDIRECT_URL;

// S3 Connection
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

module.exports = {
  /* MAKE PAYMENT */
  makePayment: async (req, res) => {
    try {
      const items = req.body.items;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "cad",
            product_data: {
              name: `${item.title} - Hosted by ${item.host}`,
              images: [item.image],
              metadata: {
                user: item.userId,
                listing: item.listingId,
                host: item.host,
                checkInDate: item.checkInDate,
                checkOutDate: item.checkOutDate,
                bookingStatus: item.bookingStatus,
                totalPrice: item.price,
              },
            },
            unit_amount: item.price * 100, // Price must always be in cents
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${redirectUrl}/account/bookings`,
        cancel_url: `${redirectUrl}/payment-canceled`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        error: "An error occurred while creating the payment session.",
      });
    }
  },
  /* Get Payment Details */
  getPaymentDetails: async (req, res) => {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send("Session ID is required");
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price.product", "line_items"], // required to have metadata defined
      });
      // Check if there is a payment_intent associated with the session
      if (!session.payment_intent) {
        return res.status(404).send("No payment intent found");
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      // Check if line items exist and have necessary data
      if (!session.line_items || session.line_items.data.length === 0) {
        return res.status(404).send("No line items found");
      }

      // Retrieve metadata from the first line item's product data
      const metadata = session.line_items.data[0].price.product.metadata;

      const details = {
        paymentStatus: paymentIntent.status,
        amountPaid: paymentIntent.amount_received / 100, // converting to dollars
        currency: paymentIntent.currency.toUpperCase(),
        paymentId: paymentIntent.id,
        metadata: metadata,
      };

      res.json(details);
    } catch (error) {
      console.error("Error fetching payment details from Stripe:", error);
      res.status(500).json({ error: "Failed to retrieve payment information" });
    }
  },
  /* MAKE BOOKING */
  makeBooking: async (req, res) => {
    const payload = req.body;
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      // Verifying the webhook signature
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_KEY
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items.data.price.product", "line_items"], // required to have metadata defined
          }
        );

        // Check if there is a payment_intent associated with the session
        if (!session.payment_intent) {
          return res.status(404).send("No payment intent found");
        }

        // Retrieve metadata from the first line item's product data
        const metadata = session.line_items.data[0].price.product.metadata;

        const {
          user,
          listing,
          checkInDate,
          checkOutDate,
          totalPrice,
          bookingStatus,
        } = metadata;

        if (
          !user ||
          !listing ||
          !checkInDate ||
          !checkOutDate ||
          !totalPrice ||
          !bookingStatus
        ) {
          console.log("Missing required booking details");
          return res.status(400).json({
            message: "Missing required booking details",
          });
        }

        const paymentId = session.payment_intent;

        const newBooking = new Booking({
          user,
          listing,
          checkInDate,
          checkOutDate,
          totalPrice,
          bookingStatus,
          paymentId,
        });

        await newBooking.save();
        console.log("Booking created successfully:", newBooking);
      } catch (error) {
        console.error("Error retrieving checkout session:", error);
        return res.status(500).json({
          message: "Failed to retrieve checkout session",
          error: error.message,
        });
      }
    }

    // Return a response to Stripe
    res.json({ received: true });
  },
  /* GET ALL BOOKINGS MADE BY A USER */
  getMyBookings: async (req, res) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    try {
      const bookings = await Booking.find({ user: userId }).populate("listing");

      // Check for "Expired Bookings"
      const updatedBookings = bookings.map((booking) => {
        if (
          booking.bookingStatus === "Confirmed" &&
          new Date(booking.checkInDate) < new Date()
        ) {
          booking.bookingStatus = "Expired";
        }
        return booking;
      });

      const bookingsWithSignedUrls = await Promise.all(
        updatedBookings.map(async (booking) => {
          const signedUrls = await Promise.all(
            booking.listing.listingPhotoPaths.map(async (key) => {
              const getObjectParams = {
                Bucket: bucketName,
                Key: key,
              };

              const command = new GetObjectCommand(getObjectParams);
              const url = await getSignedUrl(s3Client, command, {
                expiresIn: 60 * 60 * 24,
              });
              return url;
            })
          );

          return {
            ...booking.toObject(),
            listing: {
              ...booking.listing.toObject(),
              signedUrls,
            },
          };
        })
      );

      res.status(200).json(bookingsWithSignedUrls);
    } catch (error) {
      console.error("Failed to retrieve bookings", error);
      res.status(500).json({
        message: "Failed to retrieve bookings",
        error: error.message,
      });
    }
  },
  /* CANCEL BOOKING */
  cancelBooking: async (req, res) => {
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).send("Booking ID is required");
    }

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).send("Booking not found");
      }

      // Requesting a refund
      if (booking.paymentId) {
        await stripe.refunds.create({
          payment_intent: booking.paymentId,
        });
      }

      // Update the booking status to "Canceled"
      booking.bookingStatus = "Canceled";
      await booking.save();

      res
        .status(200)
        .json({ message: "Booking cancelled and refunded successfully" });
    } catch (error) {
      console.error("Failed to cancel booking", error);
      res.status(500).json({
        error: "An error occurred while cancelling the booking",
        details: error.message,
      });
    }
  },
  /* GET BOOKINGS BY LISTING ID */
  getBookingsByListingId: async (req, res) => {
    const listingId = req.params.id;

    if (!listingId) {
      return res.status(400).json({
        message: "Listing ID is required",
      });
    }

    try {
      const bookings = await Booking.find({
        listing: listingId,
        bookingStatus: "Confirmed",
      });

      const bookingDetails = bookings.map((booking) => booking.toObject());

      res.status(200).json(bookingDetails);
    } catch (error) {
      console.error("Failed to retrieve bookings by listing ID", error);
      res.status(500).json({
        message: "Failed to retrieve bookings by listing ID",
        error: error.message,
      });
    }
  },
};
