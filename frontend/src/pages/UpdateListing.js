import React, { useEffect } from "react";
import "../styles/CreateListing.scss";
import { categories, types, facilities } from "../assets/data/data";

import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import "../styles/confirmationToast.scss"; // to check error
import { IoIosImages } from "react-icons/io";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

const UpdateListing = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // State variables for form fields
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [formLocation, setFormLocation] = useState({
    street: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });
  const [guestCount, setGuestCount] = useState(null);
  const [bedroomCount, setBedroomCount] = useState(null);
  const [bedCount, setBedCount] = useState(null);
  const [bathroomCount, setBathroomCount] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    pricePerNight: null,
  });

  useEffect(() => {
    // Fetch listing data
    const fetchListingData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/listing/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Update form fields with fetched data
          setCategory(data.category);
          setType(data.type);
          setFormLocation({
            street: data.street,
            aptSuite: data.aptSuite,
            city: data.city,
            province: data.province,
            country: data.country,
          });
          setGuestCount(data.guestCount);
          setBedroomCount(data.bedroomCount);
          setBedCount(data.bedCount);
          setBathroomCount(data.bathroomCount);
          setFormDescription({
            title: data.title,
            description: data.description,
            pricePerNight:
              data.pricePerNight &&
              parseFloat(data.pricePerNight.$numberDecimal),
          });
          // Set amenities
          const amenitiesArray = data.amenities[0].split(",");
          setAmenities(amenitiesArray);
          // Set photos
          setPhotos(data.signedUrls);
        } else {
          console.error("Failed to fetch listing data:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch listing data:", error.message);
      }
    };

    fetchListingData();
  }, [id, getAccessTokenSilently]);

  // Function to handle location change
  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle amenity selection
  const handleSelectAmenities = (amenityName) => {
    setAmenities((prevAmenities) => {
      if (prevAmenities.includes(amenityName)) {
        return prevAmenities.filter((amenity) => amenity !== amenityName);
      } else {
        return [...prevAmenities, amenityName];
      }
    });
  };

  // Function to handle photo upload
  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
  };

  // Function to handle photo removal
  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  // Function to handle description change
  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Prepare the updated listing data
      const updatedListingData = {
        category,
        type,
        location: {
          street: formLocation.street,
          aptSuite: formLocation.aptSuite,
          city: formLocation.city,
          province: formLocation.province,
          country: formLocation.country,
        },
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        photos,
        description: {
          title: formDescription.title,
          description: formDescription.description,
          pricePerNight: formDescription.pricePerNight,
        },
      };

      console.log("Updated Listing Data:", updatedListingData);

      const accessToken = await getAccessTokenSilently();

      // Send a PUT request to update the listing
      const response = await fetch(`${API_BASE_URL}/listing/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedListingData),
      });

      console.log("Response:", response);

      if (response.ok) {
        console.log("Listing updated successfully");
        toast.success("Listing updated successfully");
        navigate("/account/listings");
      } else {
        console.error("Failed to update listing:", response.statusText);
        toast.error("Failed to update listing");
      }
    } catch (error) {
      console.error("Failed to update listing:", error.message);
      toast.error("Failed to update listing");
    }
  };

  return (
    <>
      <div className="create-listing">
        <h1>Update Your Place</h1>
        <form onSubmit={handleUpdate}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            <h3>Which of these categories best describes your place?</h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>What type of place will guests have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>

            <h3>Where's your place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="Street"
                  name="street"
                  value={formLocation.street}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      guestCount > 1 && setGuestCount(guestCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setGuestCount(guestCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedroomCount(bedroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedCount > 1 && setBedCount(bedCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedCount(bedCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBathroomCount(bathroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />

            <h3>Tell guests what your place has to offer</h3>
            <div className="amenities">
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <h3>Add some photos of your place</h3>
            <div className="photos">
              {photos.length < 1 && (
                <>
                  <input
                    id="image"
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleUploadPhotos}
                    multiple
                  />
                  <label htmlFor="image" className="alone">
                    <div className="icon">
                      <IoIosImages />
                    </div>
                    <p>Upload from your device</p>
                  </label>
                </>
              )}

              {photos.length >= 1 && (
                <>
                  {photos.map((photoUrl, index) => (
                    <div key={index} className="photo">
                      <img src={photoUrl} alt={`Uploaded place ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <BiTrash />
                      </button>
                    </div>
                  ))}
                  <input
                    id="image"
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleUploadPhotos}
                    multiple
                  />
                  <label htmlFor="image" className="together">
                    <div className="icon">
                      <IoIosImages />
                    </div>
                    <p>Upload more photos</p>
                  </label>
                </>
              )}
            </div>

            <h3>What make your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
              />
              <p>Now, set your PRICE</p>
              <span>$</span>
              <input
                type="number"
                name="pricePerNight"
                value={formDescription.pricePerNight}
                onChange={handleChangeDescription}
                className="price"
                required
              />
            </div>
          </div>

          <button className="submit_btn" type="submit">
            UPDATE LISTING
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateListing;
