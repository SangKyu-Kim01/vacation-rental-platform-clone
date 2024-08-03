import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { types, facilities } from "../../assets/data/data";

export default function ListingFilter({ setSelectedFilter }) {
  const [open, setOpen] = useState(false);
  const [bedroom, setBedroom] = useState();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState();
  const [bathroom, setBathroom] = useState();
  const [bed, setBed] = useState();

  const handleListingTypeChange = (event) => {
    const listingType = event.target.value;
    setSelectedTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, listingType]
        : prevTypes.filter((listing) => listing !== listingType)
    );
  };
  const handleStarsChange = (event) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleFacilityChange = (event) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  const handleBedroomChange = (event) => {
    setBedroom(event.target.value);
  };
  const handleBedChange = (event) => {
    setBed(event.target.value);
  };
  const handleBathroomChange = (event) => {
    setBathroom(event.target.value);
  };
  const handlePriceChange = (event) => {
    setSelectedPrice(
      event.target.value ? parseInt(event.target.value) : undefined
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectedFilter({
      listingTypes: selectedTypes,
      facilities: selectedFacilities,
      averageRate: selectedStars,
      pricePerNight: selectedPrice,
      bedroom: bedroom,
      bathroom: bathroom,
      bed: bed,
    });

    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Filter
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
        maxWidth="lg"
      >
        <DialogTitle
          style={{
            fontSize: "25px",
          }}
        >
          Filter
        </DialogTitle>
        <DialogContent>
          <h5 className="text-md font-semibold mb-2">Type of listing:</h5>
          {types.map((listingType) => (
            <label
              className="flex items-center space-x-2"
              key={listingType.name}
              style={{
                marginRight: "15px",
                fontSize: "15px",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                className="rounded "
                value={listingType.name}
                checked={selectedTypes.includes(listingType.name)}
                onChange={handleListingTypeChange}
              />
              <span>{listingType.name}</span>
            </label>
          ))}
          {/* need fix backend search query */}
          {/* <h4 className="text-md font-semibold mb-2">Facilities</h4>
          {facilities.map((facility) => (
            <label className="flex items-center space-x-2" key={facility.name}>
              <input
                type="checkbox"
                className="rounded"
                value={facility.name}
                checked={selectedFacilities.includes(facility.name)}
                onChange={handleFacilityChange}
              />
              <span>{facility.name}</span>
            </label>
          ))} */}
          <h5 className="text-md font-semibold mb-2">Listing Rating</h5>
          {["5", "4", "3", "2", "1"].map((star) => (
            <label
              className="flex items-center space-x-2"
              style={{
                marginRight: "15px",
                fontSize: "15px",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                className="rounded"
                value={star}
                checked={selectedStars.includes(star)}
                onChange={handleStarsChange}
              />
              <span>{star} Stars</span>
            </label>
          ))}
          <h5 className="text-md font-semibold mb-2">Rooms and Beds</h5>
          <div>
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              style={{
                marginBottom: "20px",
              }}
            >
              <InputLabel
                id="demo-simple-select-helper-label"
                style={{
                  fontSize: "15px",
                }}
              >
                Bedrooms
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={bedroom}
                label="Bedroom"
                onChange={handleBedroomChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Bathrooms
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={bathroom}
                label="Bathroom"
                onChange={handleBathroomChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">Beds</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={bed}
                label="Beds"
                onChange={handleBedChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
              </Select>
            </FormControl>
            <h5 className="text-md font-semibold mb-2"> Max Price</h5>
            <select
              className="p-2 border rounded-md w-full"
              value={selectedPrice}
              onChange={handlePriceChange}
            >
              <option
                value=""
                style={{
                  fontSize: "15px",
                }}
              >
                Select Max Price
              </option>
              {[100, 300, 500, 800, 1000, 1500].map((price) => (
                <option value={price}>{price}</option>
              ))}
            </select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Show Result</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
