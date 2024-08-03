import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useSearchContext } from "../auth/SearchContext";
import { Card, Container, Row, Col } from "react-bootstrap";
import ListingCard from "../components/listing/ListingCard";
import categories from "../components/category/CategoriesList";
import ListingFilter from "../components/listing/ListingFilter";
import ListingGoogleMap from "../components/listing/ListingGoogleMap";
import { parseISO } from "date-fns";
import axios from "axios";
import moment from "moment";
moment().format();

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SearchPage = () => {
  const search = useSearchContext();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    listingTypes: [],
    facilities: [],
    bedroom: undefined,
    bathroom: undefined,
    bed: undefined,
  });
  const handleCategoryClick = (label) => {
    setCategory(label);
  };
  const containerStyle = {
    width: "100%",
    height: "100%",
  };
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    guestCount: search.guestCount.toString(),
    page: page.toString(),
    listingTypes: selectedFilter.listingTypes,
    facilities: selectedFilter.facilities,
    averageRate: selectedFilter.averageRate,
    pricePerNight: selectedFilter.pricePerNight?.toString(),
    bedroom: selectedFilter.bedroom?.toString(),
    bathroom: selectedFilter.bathroom?.toString(),
    bed: selectedFilter.bed?.toString(),
    category: category,
  };
  const searchListings = async (searchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("guestCount", searchParams.guestCount || "");
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.pricePerNight || "");
    searchParams.facilities?.forEach((facility) =>
      queryParams.append("amenities", facility)
    );

    searchParams.listingTypes?.forEach((listingType) =>
      queryParams.append("listingTypes", listingType)
    );
    searchParams.averageRate?.forEach((star) =>
      queryParams.append("averageRate", star)
    );
    queryParams.append("bedroom", searchParams.bedroom || "");
    queryParams.append("bed", searchParams.bed || "");
    queryParams.append("bathroom", searchParams.bathroom || "");
    queryParams.append("category", searchParams.category || "");
    const response = await fetch(`${BASE_URL}/listing/search?${queryParams}`);

    if (!response.ok) {
      throw new Error("Error fetching listings");
    }

    return response.json();
  };
  const {
    data: listingsData,
    isLoading,
    error,
  } = useQuery(["searchListings", searchParams], () =>
    searchListings(searchParams)
  );
  useEffect(() => {
    const filterListings = async () => {
      if (!listingsData) return [];
      const listings = listingsData.data;
      const filteredListingsfunction = await Promise.all(
        listings.map(async (listing) => {
          const getBookingDates = async () => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/booking/${listing._id}`
              );
              const bookedDates = response.data.map((booking) => ({
                start: parseISO(booking.checkInDate),
                end: parseISO(booking.checkOutDate),
              }));

              return bookedDates.flatMap((d) => {
                const range = [];
                let current = new Date(d.start);
                while (current <= d.end) {
                  range.push(new Date(current));
                  current.setDate(current.getDate() + 1);
                }
                console.log("rangerange", range);
                return range;
              });
            } catch (error) {
              console.error("Failed to fetch booking dates:", error);
              return [];
            }
          };

          const disabledDates = await getBookingDates();
          const disabledmoment = disabledDates.map((date1) => moment(date1));
          console.log("disabled dates", disabledmoment);

          const current = moment(search.checkIn);
          console.log("current,", current);
          const end = moment(search.checkOut);
          console.log("endend:", end);
          const isListingAvailable = () => {
            const allDates = [];
            let currentDate = moment(search.checkIn);
            const endDate = moment(search.checkOut);

            while (currentDate <= endDate) {
              allDates.push(currentDate.format("YYYY-MM-DD"));
              currentDate.add(1, "days");
            }

            const allDatesInDisabled = allDates.every((date) =>
              disabledmoment.find(
                (disabledDate) => disabledDate.format("YYYY-MM-DD") === date
              )
            );

            return !allDatesInDisabled;
          };

          const booleanresult = isListingAvailable();
          console.log("boolean result========", booleanresult);
          if (booleanresult) {
            return listing;
          } else {
            return null;
          }
        })
      );

      console.log("filtered listings function", filteredListingsfunction);

      const filteredListingsWithoutNull = filteredListingsfunction.filter(
        (listing) => listing !== null
      );

      console.log(
        "filtered listings without null",
        filteredListingsWithoutNull
      );
      setFilteredListings(filteredListingsWithoutNull);
    };

    filterListings();
  }, [listingsData, search.checkIn, search.checkOut]);

  console.log("result=====", filteredListings);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!listingsData || listingsData.data.length === 0) {
    return (
      <>
        <div className="mb-5">
          <Container>
            <div
              className="d-flex flex-row align-items-center justify-content-between overflow-x-auto"
              style={{ marginTop: "100px" }}
            >
              {categories.map((category) => (
                <div key={category.label}>
                  <Card
                    className="rounded-circle border-0 shadow-sm"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategoryClick(category.label)}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <div className="text-center mb-3">
                        <category.Icon size={20} />
                      </div>
                      <Card.Title
                        className="text-center fw-medium"
                        style={{ fontSize: "10px" }}
                      >
                        {category.label}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              ))}
              <ListingFilter setSelectedFilter={setSelectedFilter} />
            </div>
          </Container>
        </div>
        <div
          className="mt-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          No listings found.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-5">
        <Container>
          <div
            className="d-flex flex-row align-items-center justify-content-between overflow-x-auto"
            style={{ marginTop: "100px" }}
          >
            {categories.map((category) => (
              <div key={category.label}>
                <Card
                  className="rounded-circle border-0 shadow-sm"
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick(category.label)}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center mb-3">
                      <category.Icon size={20} />
                    </div>
                    <Card.Title
                      className="text-center fw-medium"
                      style={{ fontSize: "10px" }}
                    >
                      {category.label}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
            <ListingFilter setSelectedFilter={setSelectedFilter} />
          </div>
        </Container>
      </div>
      <div className="mb-5">
        <div className="pt-0">
          <Container>
            <Row>
              <Col lg={8}>
                {filteredListings.length > 0 ? (
                  <Container>
                    <Row>
                      {filteredListings.map((listing) => (
                        <Col lg="4" className="mb-4" key={listing._id}>
                          <ListingCard listing={listing} />
                        </Col>
                      ))}
                    </Row>
                  </Container>
                ) : (
                  <div
                    className="mt-5 d-flex justify-content-center align-items-center"
                    style={{ minHeight: "100vh" }}
                  >
                    <h1>No result found</h1>
                  </div>
                )}
              </Col>
              <Col lg={4}>
                {filteredListings.length > 0 && (
                  <ListingGoogleMap
                    listings={filteredListings}
                    containerStyle={containerStyle}
                  />
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
