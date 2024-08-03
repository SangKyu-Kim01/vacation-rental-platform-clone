const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Listing",
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    bookingStatus: {
      type: String,
      required: true,
      enum: ["Confirmed", "Pending", "Expired", "Canceled"],
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to automatically populate 'user' and 'listing' fields in find queries
bookingSchema.pre(/^find/, function (next) {
  this.populate("user");
  this.populate("listing");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
