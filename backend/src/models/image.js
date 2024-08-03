const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
  imagePath: {
    type: String,
    maxlength: 255,
  },
  imageFilename: {
    type: String,
    maxlength: 100,
  },
  imageOrder: {
    type: Number,
    required: true,
  },
  isMainImage: {
    type: Boolean,
    required: true,
  },
});

// Middleware to automatically populate 'listing' field in find queries
imageSchema.pre(/^find/, function (next) {
  this.populate("listing");
  next();
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
