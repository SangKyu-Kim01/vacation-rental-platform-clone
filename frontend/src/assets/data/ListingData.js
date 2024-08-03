import listingimg1 from "../images/listing-1.jpg";
import listingimg2 from "../images/listing-2.jpg";
import listingimg3 from "../images/listing-3.jpg";
import listingimg4 from "../images/listing-4.jpeg";
import listingimg5 from "../images/listing-5.jpg";
import listingimg6 from "../images/listing-6.jpg";

const listings = [
  {
    listingId: "1",
    hostId: "2",
    title: "listing 01",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Modern",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 Main street",
    city: "New York City",
    state: "NY",
    postal: "",
    country: "USA",
    numBedroom: 2,
    numBeds: 6,
    numBathrooms: 2,
    maxGuests: 4,
    reviews: [
      {
        userId: 5,
        rating: 4,
      },
      {
        userId: 3,
        rating: 5,
      },
      {
        userId: 2,
        rating: 2,
      },
    ],
    isFavorite: 1,
    photo: listingimg1,
  },

  {
    listingId: "2",
    hostId: "",
    title: "listing 02",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Luxury",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 2nd street",
    city: "Montreal",
    state: "QC",
    postal: "",
    country: "Canada",
    numBeds: 6,
    numBathrooms: 2,
    reviews: [],
    averageRate: 4.8,
    isFavorite: 1,
    photo: listingimg2,
  },
  {
    listingId: "3",
    hostId: "",
    title: "listing 03",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Cabin",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 Main street",
    city: "Banff, Calgary",
    state: "AB",
    postal: "",
    country: "Canada",
    numBeds: 6,
    numBathrooms: 2,
    reviews: [
      {
        userId: 5,
        rating: 4,
      },
    ],
    averageRate: 4.8,
    isFavorite: 1,
    photo: listingimg3,
  },
  {
    listingId: "4",
    hostId: "",
    title: "listing 04",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Modern",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 Main street",
    city: "San Jose",
    state: "CA",
    postal: "",
    country: "USA",
    numBeds: 6,
    numBathrooms: 2,
    reviews: [
      {
        userId: 5,
        rating: 4,
      },
    ],
    averageRate: 4.8,
    isFavorite: "",
    photo: listingimg4,
  },
  {
    listingId: "5",
    hostId: "",
    title: "listing 05",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Modern",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 Main street",
    city: "San Francisco",
    state: "CA",
    postal: "",
    country: "USA",
    numBeds: 6,
    numBathrooms: 2,
    reviews: [],
    averageRate: 4.8,
    isFavorite: 1,
    photo: listingimg5,
  },
  {
    listingId: "6",
    hostId: "",
    title: "listing 06",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    propertyType: "Modern",
    listingType: "",
    pricePerNight: 99.99,
    street: "123 Main street",
    city: "Vancouver",
    state: "BC",
    postal: "",
    country: "Canada",
    numBeds: 6,
    numBathrooms: 2,
    reviews: [],
    averageRate: 4.8,
    isFavorite: "",
    photo: listingimg6,
  },
];

export default listings;
