import React from "react";
import { Link } from "react-router-dom";
import logo from "../styles/assets/images/logo.png";
import "../styles/leftNav.css";
import Tweet from "./Tweet";
import Logout from "./Logout";

function LeftNav({ user }) {
  return (
    <div className="left-nav">
      <Link to="/feed" className="left-nav-box">
        <h2>
          <img src={logo} className="logo" alt="logo" />
        </h2>
      </Link>
      <Link to="/home" className="left-nav-box">
        <h2>
          <i className="fa fa-home" aria-hidden="true" />{" "}
          <span className="title">Home</span>
        </h2>
      </Link>
      <Link to="/profile" className="left-nav-box">
        <h2>
          <i className="fa fa-user" aria-hidden="true" />{" "}
          <span className="title">Profile</span>
        </h2>
      </Link>
      <Link to="/feed" className="left-nav-box">
        <h2>
          <i className="fa fa-envelope" aria-hidden="true" />{" "}
          <span className="title">Messages</span>
        </h2>
      </Link>
      <Link to="/feed" className="left-nav-box">
        <h2>
          <i className="fa fa-bell" aria-hidden="true" />{" "}
          <span className="title">Notifications</span>
        </h2>
      </Link>
      <Link to="/feed" className="left-nav-box">
        <h2>
          <i className="fa fa-ellipsis-h" aria-hidden="true" />{" "}
          <span className="title">More</span>
        </h2>
      </Link>
      <Tweet />
      <Logout user={user} />
    </div>
  );
}

export default LeftNav;
