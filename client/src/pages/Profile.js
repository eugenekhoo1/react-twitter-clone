import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import LeftNav from "../components/LeftNav";
import "../styles/primary.css";
import "../styles/profile.css";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import UserTweets from "../components/UserTweets";
import profile from "../styles/assets/images/profile.png";

const Profile = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth?.user;
  const id = auth?.id;

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Get user profile once page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(`Profile user: ${user}`);
        const response = await axios.get(`/view/profile/${user}`);
        console.log(
          `fetchUserProfile response: ${response.data[0].display_name}`
        );
        setDisplayName(response.data[0].display_name);
        setBio(response.data[0].bio);
        setLocation(response.data[0].location);
        setWebsite(response.data[0].website);
        setFollowerCount(response.data[0].follower.length);
        setFollowingCount(response.data[0].following.length);
      } catch (err) {
        console.error(`Profile: ${err}`);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav user={user} />
        </div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3>{displayName}</h3>
              </span>
            </div>
            <div className="avatar">
              <img
                src={profile}
                style={{ width: "150px", borderRadius: "50%" }}
                alt="avatar"
              />
            </div>
            <div className="make-profile">
              <EditProfile user={user} />
            </div>

            <h3 className="profile-name">
              <p>{displayName}</p>
            </h3>
            <p>@{user}</p>
            {auth ? (
              <p>
                <i className="fas fa-link"> </i>{" "}
                <Link to={{ pathname: `http://${website}` }}>{website}</Link>
              </p>
            ) : null}
            <div className="followers">
              <p>{followingCount} following</p>
              <p>{followerCount} followers</p>
            </div>
          </div>
          <UserTweets user={user} id={id} viewUser={user} />
        </div>
        <div className="right"></div>
      </div>
    </>
  );
};

export default Profile;
