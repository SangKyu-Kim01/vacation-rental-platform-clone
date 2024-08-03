const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multer");
const { jwtCheck, jwtParse } = require("../middleware/auth");

/* Controller */
const listingController = require("../controllers/listingController");

/* CREATE LISTING */
router.post(
  "/create",
  jwtCheck,
  jwtParse,
  upload.array("listingPhotos"),
  listingController.createListing
);

/* GET LISTINGS BY CATEGORY */
router.get("/", listingController.getListingsByCategory);

/* GET Listing by search*/
router.get("/search", listingController.getListingBySearch);

/* GET LISTING BY Id */
router.get("/:id", listingController.getListingsById);

/* DELETE LISTING BY ID */
router.delete("/:id", listingController.deleteListing);

/* UPDATE LISTING BY ID */
router.put("/:id", jwtCheck, jwtParse, listingController.updateListing);

module.exports = router;
