const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { jwtCheck, jwtParse } = require("../middleware/auth");

require("dotenv").config();

/* CREATE REVIEW */
router.post("/create", jwtCheck, jwtParse, reviewController.createReview);

/* GET ALL REVIEWS */
router.get("/", reviewController.getAllReviews);

/* GET REVIEW BY Id */
router.get("/:id", jwtCheck, jwtParse, reviewController.getReviewById);

/* GET REVIEWS BY LISTING ID */
router.get("/listing/:listingId", reviewController.getReviewByListing);

/* DELETE REVIEW BY ID */
router.delete("/:id", jwtCheck, jwtParse, reviewController.deleteReview);

/* UPDATE REVIEW BY ID */
router.put("/:id", jwtCheck, jwtParse, reviewController.updateReview);

module.exports = router;
