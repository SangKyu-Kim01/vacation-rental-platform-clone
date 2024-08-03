const Review = require("../models/review");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

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

const createReview = async (req, res) => {
  try {
    const { listing, user, rating, reviewText } = req.body;
    const newReview = new Review({ listing, user, rating, reviewText });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating review" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching review" });
  }
};

const getReviewByListing = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const reviews = await Review.find({ listing: listingId }).populate("user");

    // Generating imageUrl for each user
    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        if (review.user && review.user.imageName) {
          const imageUrlParams = {
            Bucket: bucketName,
            Key: review.user.imageName,
          };

          const imageUrlCommand = new GetObjectCommand(imageUrlParams);
          review.user.imageUrl = await getSignedUrl(s3Client, imageUrlCommand, {
            expiresIn: 60 * 60 * 24,
          });
        }
      }
    }
    // End Generating imageUrl for users

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewByListing,
  deleteReview,
  updateReview,
};
