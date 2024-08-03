const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be greater than 5"],
  },
  reviewText: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to automatically populate 'user' and 'listing' fields in find queries
reviewSchema.pre(/^find/, function (next) {
  this.populate("user");
  this.populate("listing");
  next();
});

// Middleware to update the associated listing when a review is created or edited
reviewSchema.post("save", async function (review) {
  const Listing = mongoose.model("Listing");

  try {
    // Retrieve the associated listing
    const listing = await Listing.findById(review.listing);

    if (!listing) {
      throw new Error("Associated listing not found.");
    }

    // Update the listing's average rating based on the new review
    const reviews = await Review.find({ listing: listing._id });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    listing.averageRate = totalRating / reviews.length;

    // Save the updated listing
    await listing.save();
  } catch (error) {
    console.error("Error updating listing:", error);
  }
});

// Middleware to update the associated listing when a review is deleted
reviewSchema.post("remove", async function (review) {
  const Listing = mongoose.model("Listing");

  try {
    // Retrieve the associated listing
    const listing = await Listing.findById(review.listing);

    if (!listing) {
      throw new Error("Associated listing not found.");
    }

    // Find all reviews for the listing excluding the removed one
    const remainingReviews = await Review.find({
      listing: listing._id,
      _id: { $ne: review._id },
    });

    // Calculate the total rating
    let totalRating = 0;
    if (remainingReviews.length > 0) {
      totalRating = remainingReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
    }

    // Update the listing's average rating
    listing.averageRate =
      remainingReviews.length > 0 ? totalRating / remainingReviews.length : 0;

    // Save the updated listing
    await listing.save();

    console.log("Listing Updated Successfully");
  } catch (error) {
    console.error("Error updating listing:", error);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
