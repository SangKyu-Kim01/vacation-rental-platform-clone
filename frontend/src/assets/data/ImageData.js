import listingimg1 from "../images/listing-1.jpg";
import listingimg2 from "../images/listing-2.jpg";
import listingimg3 from "../images/listing-3.jpg";
import listingimg4 from "../images/listing-4.jpeg";
import listingimg5 from "../images/listing-5.jpg";
import listingimg6 from "../images/listing-6.jpg";

const photos = [
  {
    imageId: "1",
    listingId: "1",
    imageFilename: "listingimg1.jpg",
    imagePath: listingimg1,
    imageOrder: 1,
    location: "house",
    isMain: true,
  },
  {
    imageId: "2",
    listingId: "1",
    imageFilename: "listingimg2.jpg",
    imagePath: listingimg2,
    imageOrder: 2,
    location: "bathroom",
    isMain: false,
  },
  {
    imageId: "3",
    listingId: "1",
    imageFilename: "listingimg3.jpg",
    imagePath: listingimg3,
    imageOrder: 3,
    location: "livingroom",
    isMain: false,
  },
  {
    imageId: "4",
    listingId: "1",
    imageFilename: "listingimg4.jpeg",
    imagePath: listingimg4,
    imageOrder: 4,
    location: "kitchen",
    isMain: false,
  },
  {
    imageId: "5",
    listingId: "1",
    imageFilename: "listingimg5.jpg",
    imagePath: listingimg5,
    imageOrder: 5,
    location: "bedroom",
    isMain: false,
  },
];

export default photos;
