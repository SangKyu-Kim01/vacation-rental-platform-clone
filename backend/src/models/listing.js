const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    aptSuite: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    // postal: {
    //  type: String,
    //  required: true,
    //  maxlength: 20,
    //  validate: {
    //    validator: function (value) {
    //      return validator.isPostalCode(value, "any");
    //    },
    //    message: (props) => `${props.value} is not a valid postal code`,
    //  },
    //},
    guestCount: {
      type: Number,
      required: true,
    },
    bedroomCount: {
      type: Number,
      required: true,
    },
    bedCount: {
      type: Number,
      required: true,
    },
    bathroomCount: {
      type: Number,
      required: true,
    },
    amenities: {
      type: Array,
      default: [],
    },

    // FIXME
    listingPhotoPaths: [{ type: String }], // Store photo URLs

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    averageRate: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// // Optional
// // Need middleware .pre to ensure monetary values
// listingSchema.pre('save', function(next) {
//   if (this.isModified('pricePerNight')) {
//     // pricePerNight is rounded to two decimal places
//     this.pricePerNight = parseFloat(this.pricePerNight.toFixed(2));
//   }
//   next();
// });

// Middleware to automatically populate the host field in the document (acts like a "join" in SQL)
listingSchema.pre(/^find/, function (next) {
  this.populate("host");
  next();
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
