import { useState, useEffect } from "react";
import Modal from "react-modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import { customStyles } from "../styles/CustomModalStyles";
import "../styles/editProfile.css";
import defaultProfile from "../styles/assets/images/default.png";

const EditProfile = ({ user }) => {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fillEditPage = async () => {
      const getUserProfile = await axios.get(`/view/profile/${user}`);
      setDisplayName(getUserProfile.data[0].display_name);
      setBio(getUserProfile.data[0].bio);
      setLocation(getUserProfile.data[0].location);
      setWebsite(getUserProfile.data[0].website);
      setAvatarUrl(getUserProfile.data[0].avatar);
    };

    fillEditPage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    // API request to update profile
    try {
      const response = await axiosPrivate.post(
        "/profile/edit",
        JSON.stringify({ user, displayName, bio, location, website }),
        {
          signal: controller.signal,
        }
      );

      if (imageUpload) {
        const data = new FormData();

        data.append("avatar", imageUpload);
        data.append("user", user);

        const response = await axios.post("/upload/avatar", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = response.data.downloadURL;
        setAvatarUrl(imageUrl);
      }
      setDisplayName("");
      setBio("");
      setLocation("");
      setWebsite("");
      closeModal();
      refreshWindow();
    } catch (err) {
      console.error(err.message);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImageUpload(image);

    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <>
      <button onClick={openModal} className="edit-button">
        Edit profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-label">Profile Picture</div>
          <div className="avatar-upload-container">
            <label className="avatar-label" htmlFor="avatar">
              <span>Upload Image</span>
            </label>
            <input
              type="file"
              id="avatar"
              className="avatar-upload"
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
            {avatarUrl ? (
              <img src={avatarUrl} id="avatar-display" />
            ) : (
              <img src={defaultProfile} id="avatar-display" />
            )}
          </div>

          <label htmlFor="displayName" className="form-label">
            Name
          </label>
          <input
            className="form"
            type="text"
            id="displayName"
            autoComplete="off"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            placeholder="Name"
          />
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <input
            className="form"
            type="text"
            id="bio"
            autoComplete="off"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Bio"
          />
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            className="form"
            type="location"
            id="location"
            autoComplete="off"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            placeholder="Location"
          />
          <label htmlFor="website" className="form-label">
            Name
          </label>
          <input
            className="form"
            type="website"
            id="website"
            autoComplete="off"
            onChange={(e) => setWebsite(e.target.value)}
            value={website}
            placeholder="Website"
          />
          <button type="submit" className="login-button">
            <span>Save</span>
          </button>
        </form>
      </Modal>
    </>
  );
};

export default EditProfile;
