import React, { useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import ProfileNav from "../shared/ProfileNav";
import "../styles/Profile.scss";
import { useGetMyUser, useUpdateMyUser } from "../api/UserApi";
import { toast } from "react-toastify";

function Profile() {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  const [formData, setFormData] = useState({
    username: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    image: null,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        address: currentUser.address,
        city: currentUser.city,
        country: currentUser.country,
        phone: currentUser.phone,
        image: null,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !formData.username ||
      !formData.address ||
      !formData.city ||
      !formData.country ||
      !formData.phone
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const formDataForUpdate = new FormData();
      formDataForUpdate.append("username", formData.username);
      formDataForUpdate.append("address", formData.address);
      formDataForUpdate.append("city", formData.city);
      formDataForUpdate.append("country", formData.country);
      formDataForUpdate.append("phone", formData.phone);
      if (formData.image) {
        formDataForUpdate.append("image", formData.image);
      }
      await updateUser(formDataForUpdate);
      toast.success("User updated successfully");
      window.location.reload(); // Refresh the page after updating profile
    } catch (error) {
      toast.error(error.toString());
    }
  };

  if (isGetLoading) {
    return <span>Loading...</span>;
  }

  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <div className="profile">
      <ProfileNav />
      <h1 className="text-center">My Profile</h1>
      <Form onSubmit={handleSubmit}>
        <div className="profile_form d-flex flex-row justify-content-center align-items-center shadow">
          <div className="mb-4 text-center d-flex flex-column px-5">
            <Image
              src={currentUser.imageUrl}
              alt="Profile Picture"
              rounded
              style={{ width: "300px" }}
            />
            <Form.Group>
              <Form.Label>Upload Picture</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
          </div>
          <div className="profile_info mp-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Update Profile
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Profile;
