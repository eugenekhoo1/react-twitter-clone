import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import "../styles/logout.css";
import { logoutModalStyles } from "../styles/LogoutModal";
import profile from "../styles/assets/images/profile.png";

const Logout = ({ user }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogout = async () => {
    console.log("Logging out..");
    await logout();
    navigate("/");
    console.log("Logout");
  };

  return (
    <div className="logout">
      <span
        onClick={openModal}
        style={{ flex: 1, flexDirection: "row", backgroundColor: "#ee5555" }}
      >
        <h4>
          <img
            src={profile}
            style={{ width: "40px", borderRadius: "50%" }}
            alt="avatar"
          />
          <span
            style={{ marginLeft: "10px", marginTop: "-10px", fontSize: "16px" }}
          >
            {user}
          </span>
          <span style={{ marginLeft: "15px" }}>
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </h4>
      </span>
      <div style={{ position: "absolute", bottom: 0 }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          style={logoutModalStyles}
        >
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            <h5>
              Log out{" "}
              <span style={{ borderBottom: "1px solid black" }}>@{user}</span>
            </h5>
          </span>
        </Modal>
      </div>
    </div>
  );
};

export default Logout;
