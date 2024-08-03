import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetMyUser } from "../api/UserApi";
import "../styles/admin.css";

function Admin() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const { getAccessTokenSilently, user } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useGetMyUser();

  const fetchUsers = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsAdmin(currentUser && currentUser.role === "Admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!currentUser) {
      setLoading(false);
      setIsAdmin(false);
    } else {
      checkAdminStatus();
    }

    fetchUsers();
  }, [currentUser, getAccessTokenSilently]);

  const handleDeleteUser = async (userId) => {
    try {
      toast.info(
        <div className="confirmation-toast">
          <div className="message">
            Are you sure you want to delete this user?
          </div>
          <div className="button-container">
            <button
              className="confirm-button"
              onClick={() => {
                deleteUser(userId);
                toast.dismiss();
              }}
            >
              Yes
            </button>
            <button className="cancel-button" onClick={() => toast.dismiss()}>
              No
            </button>
          </div>
        </div>,
        { autoClose: false }
      );
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    toggleModal(true);
  };

  const handleSaveClick = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.put(
        `${API_BASE_URL}/users/${editUser._id}`,
        {
          username: editUser.username,
          email: editUser.email,
          phone: editUser.phone,
          role: editUser.role,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("User data updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data. Please try again.");
    }
    toggleModal(false);
  };

  const handleCancelClick = () => {
    toggleModal(false);
  };

  const toggleModal = (isOpen) => {
    const modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = isOpen ? "block" : "none";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="isNotAdmin">
        You are not authorized to access this page.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center" style={{ color: "#24355A" }}>
        Manage User Account
      </h1>
      <div className="adminPanel">
        <div className="adminContainer">
          <div className="adminTable">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="adminTable_btn"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="adminTable_btn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <div id="myModal" className="modal1">
          <div className="modal1-content">
            <form className="modal1-form">
              <h1>Edit User Account</h1>
              <div className="box">
                <label htmlFor="username">Username:</label>
                <input
                  className="modal1-input"
                  type="text"
                  id="username"
                  value={editUser?.username || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>
              <div className="box">
                <label htmlFor="email">Email:</label>
                <input
                  className="modal1-input"
                  type="text"
                  id="email"
                  value={editUser?.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              <div className="box">
                <label htmlFor="phone">Phone:</label>
                <input
                  className="modal1-input"
                  type="text"
                  id="phone"
                  value={editUser?.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                />
              </div>
              <div className="box">
                <label htmlFor="role">Role:</label>
                <select
                  className="modal1-input"
                  id="role"
                  value={editUser?.role || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="Guest">Guest</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal1Btn_container">
                <button
                  className="modal1_btn"
                  type="button"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
                <button
                  className="modal1_btn"
                  type="button"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
