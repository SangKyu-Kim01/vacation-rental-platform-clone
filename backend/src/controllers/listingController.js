const { ObjectId } = require("mongoose").Types;
const Listing = require("../models/listing");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

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

// For random Image name to avoid duplicates
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// Delete File
const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (err) {
    throw new Error(`Failed to delete file ${key}: ${err.message}`);
  }
};

const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.category) {
    constructedQuery.category = queryParams.category;
  }

  if (queryParams.guestCount) {
    constructedQuery.guestCount = {
      $gte: parseInt(queryParams.guestCount),
    };
  }

  // if (queryParams.facilities) {
  //   constructedQuery.amenities = {
  //     $all: Array.isArray(queryParams.facilities)
  //       ? queryParams.facilities
  //       : [queryParams.facilities],
  //   };
  // }

  if (queryParams.listingTypes) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.listingTypes)
        ? queryParams.listingTypes
        : [queryParams.listingTypes],
    };
  }

  if (queryParams.averageRate) {
    const starRatings = Array.isArray(queryParams.averageRate)
      ? queryParams.averageRate.map((star) => parseInt(star))
      : parseInt(queryParams.averageRate);

    constructedQuery.averageRate = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }
  if (queryParams.bedroom) {
    constructedQuery.bedroomCount = {
      $gte: parseInt(queryParams.bedroom),
    };
  }

  if (queryParams.bathroom) {
    constructedQuery.bathroomCount = {
      $gte: parseInt(queryParams.bathroom),
    };
  }

  if (queryParams.bed) {
    constructedQuery.bedCount = {
      $gte: parseInt(queryParams.bed),
    };
  }

  return constructedQuery;
};

module.exports = {
  /* CREATE LISTING */
  createListing: async (req, res) => {
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).send("No file uploaded.");
    }

    // Obtaining the user's _id as a string and converting it to the host objectId using auth.js middleware
    const hostId = req.userId;
    const host = new ObjectId(hostId);

    const uploadPromises = images.map((file) => {
      const imageName = randomImageName();
      const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: imageName,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      s3Client.send(command);
      return imageName;
    });

    try {
      const listingPhotoPaths = await Promise.all(uploadPromises);

      const {
        category,
        type,
        street,
        aptSuite,
        city,
        province,
        country,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        title,
        description,
        highlight,
        highlightDesc,
        pricePerNight,
      } = req.body;

      const newListing = new Listing({
        host,
        category,
        type,
        street,
        aptSuite,
        city,
        province,
        country,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        listingPhotoPaths, // This should probably be renamed to images or listingImages
        title,
        description,
        highlight,
        highlightDesc,
        pricePerNight,
      });

      await newListing.save();

      res.status(200).json(newListing);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Failed to create listing", error: err.message });
    }
  },

  getListingBySearch: async (req, res) => {
    try {
      const query = constructSearchQuery(req.query);
      const pageSize = 8;
      const pageNumber = parseInt(
        req.query.page ? req.query.page.toString() : "1"
      );
      const skip = (pageNumber - 1) * pageSize;
      const listings = await Listing.find(query)
        .populate("host")
        .skip(skip)
        .limit(pageSize);

      const total = await Listing.countDocuments(query);
      const listingsWithSignedUrls = await Promise.all(
        listings.map(async (listing) => {
          const signedUrls = await Promise.all(
            listing.listingPhotoPaths.map(async (key) => {
              const getObjectParams = {
                Bucket: bucketName,
                Key: key, // The key is imageName
              };

              const command = new GetObjectCommand(getObjectParams);
              const url = await getSignedUrl(s3Client, command, {
                expiresIn: 60 * 60 * 24,
              }); // Signed URL expires in 1 day

              return url; // The returned signed url for each image
            })
          );

          return {
            ...listing.toObject(), // Convert Mongoose document to a plain JavaScript object
            signedUrls, // Add the array of signed URLs to the listing object
          };
        })
      );

      const response = {
        data: listingsWithSignedUrls,
        pagination: {
          total,
          page: pageNumber,
          pages: Math.ceil(total / pageSize),
        },
      };
      // console.log(response);
      res.json(response);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  /* GET LISTINGS BY CATEGORY */
  getListingsByCategory: async (req, res) => {
    const qCategory = req.query.category;

    try {
      let listings;
      if (qCategory) {
        listings = await Listing.find({ category: qCategory }).populate("host");
      } else {
        listings = await Listing.find().populate("host");
      }

      // Use Promise.all to handle asynchronous operations for signed URLs
      const listingsWithSignedUrls = await Promise.all(
        listings.map(async (listing) => {
          const signedUrls = await Promise.all(
            listing.listingPhotoPaths.map(async (key) => {
              const getObjectParams = {
                Bucket: bucketName,
                Key: key, // The key is imageName
              };

              const command = new GetObjectCommand(getObjectParams);
              const url = await getSignedUrl(s3Client, command, {
                expiresIn: 60 * 60 * 24,
              }); // Signed URL expires in 1 day

              return url; // The returned signed url for each image
            })
          );

          return {
            ...listing.toObject(), // Convert Mongoose document to a plain JavaScript object
            signedUrls, // Add the array of signed URLs to the listing object
          };
        })
      );

      res.status(200).json(listingsWithSignedUrls);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to fetch listings", error: err.message });
    }
  },

  // DELETE LISTING
  deleteListing: async (req, res) => {
    const listingId = req.params.id;

    try {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // Delete photos from S3 bucket
      const deletePromises = listing.listingPhotoPaths.map(
        async (imagePath) => {
          await deleteFile(imagePath);
        }
      );
      await Promise.all(deletePromises);

      // Delete the listing from the database
      await Listing.findByIdAndDelete(listingId);

      res.status(200).json({ message: "Listing deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to delete listing", error: err.message });
    }
  },

  // UPDATE LISTING
  updateListing: async (req, res) => {
    const listingId = req.params.id;
    const updateParams = req.body;

    try {
      // Check if the listing exists
      const listing = await Listing.findById(listingId);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // Handle photo updates
      if (
        updateParams.listingPhotoPaths &&
        updateParams.listingPhotoPaths.length > 0
      ) {
        // Delete existing photos from S3
        await Promise.all(
          listing.listingPhotoPaths.map(async (imagePath) => {
            try {
              await deleteFile(imagePath);
            } catch (error) {
              console.error("Failed to delete existing photo:", error);
            }
          })
        );

        // Upload new photos to S3
        await Promise.all(
          updateParams.listingPhotoPaths.map(async (imagePath) => {
            try {
              await uploadFile(
                imagePath,
                imagePath.split("/").pop(),
                "image/jpeg"
              );
            } catch (error) {
              console.error("Failed to upload new photo:", error);
            }
          })
        );
      }

      // Update other data fields of the listing
      console.log("Before update - listing:", listing); // Debugging
      console.log("Update params:", updateParams); // Debugging

      // Update fields individually
      if (updateParams.location) {
        listing.street = updateParams.location.street || listing.street;
        listing.aptSuite = updateParams.location.aptSuite || listing.aptSuite;
        listing.city = updateParams.location.city || listing.city;
        listing.province = updateParams.location.province || listing.province;
        listing.country = updateParams.location.country || listing.country;
      }

      listing.category = updateParams.category || listing.category;
      listing.type = updateParams.type || listing.type;
      listing.guestCount = updateParams.guestCount || listing.guestCount;
      listing.bedroomCount = updateParams.bedroomCount || listing.bedroomCount;
      listing.bedCount = updateParams.bedCount || listing.bedCount;
      listing.bathroomCount =
        updateParams.bathroomCount || listing.bathroomCount;
      listing.amenities = updateParams.amenities || listing.amenities;
      listing.listingPhotoPaths =
        updateParams.photos || listing.listingPhotoPaths;

      // Update description field if provided
      if (updateParams.description) {
        listing.title = updateParams.description.title || listing.title;
        listing.description =
          updateParams.description.description || listing.description;
        listing.pricePerNight =
          updateParams.description.pricePerNight || listing.pricePerNight;
      }

      // Save the updated listing
      await listing.save();
      console.log("Listing updated successfully"); // Debugging
      res.status(200).json({ message: "Listing updated successfully" });
    } catch (err) {
      console.error("Failed to update listing:", err);
      res
        .status(500)
        .json({ message: "Failed to update listing", error: err.message });
    }
  },

  /* GET LISTINGS BY Id */
  getListingsById: async (req, res) => {
    const listingId = req.params.id;

    try {
      let listing = await Listing.findById(listingId).populate("host");

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      //  Generating imageUrl for host
      if (listing.host && listing.host.imageName) {
        const imageUrlParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: listing.host.imageName,
        };

        const imageUrlCommand = new GetObjectCommand(imageUrlParams);
        listing.host.imageUrl = await getSignedUrl(s3Client, imageUrlCommand, {
          expiresIn: 60 * 60 * 24,
        });
      }
      //  End Generating imageUrl for host

      const signedUrls = await Promise.all(
        listing.listingPhotoPaths.map(async (key) => {
          const getObjectParams = {
            Bucket: bucketName,
            Key: key,
          };

          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60 * 24, // Signed URL expires in 1 day
          });

          return url; // The returned signed URL for each image
        })
      );

      const listingWithSignedUrls = {
        ...listing.toObject(), // Convert Mongoose document to a plain JavaScript object
        signedUrls, // Add the array of signed URLs to the listing object
      };

      res.status(200).json(listingWithSignedUrls);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to fetch listing", error: err.message });
    }
  },
};
