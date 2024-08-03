import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListingApi = {
  // Fetch Listings
  fetchListings: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/listing`);
      return response.data;
    } catch (error) {
      handleError("Failed to fetch listings", error);
    }
  },

  // Create Listing
  createListing: async (formData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/listing/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      handleError("Failed to create listing", error);
    }
  },

  // Delete Listing
  deleteListing: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/listing/${id}`);
      return response.data;
    } catch (error) {
      handleError(`Failed to delete listing with ID ${id}`, error);
    }
  },

  // Update Listing
  updateListing: async (id, updateParams) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/listing/${id}`,
        updateParams
      );
      return response.data;
    } catch (error) {
      handleError(`Failed to update listing with ID ${id}`, error);
    }
  },

  searchListings: async (searchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("guestCount", searchParams.guestCount || "");
    queryParams.append("page", searchParams.page || "");
    const response = await fetch(`${BASE_URL}/listing/search?${queryParams}`);

    if (!response.ok) {
      throw new Error("Error fetching listings");
    }

    return response.json();
  },
  // Fetch Listing by ID
  fetchListingById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/listing/${id}`);
      return response.data;
    } catch (error) {
      handleError(`Failed to fetch listing with ID ${id}`, error);
    }
  },
};

const handleError = (message, error) => {
  console.error(`${message}:`, error);
  throw error;
};

export default ListingApi;
