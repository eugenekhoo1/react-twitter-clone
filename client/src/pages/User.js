import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import "../styles/primary.css";
import "../styles/profile.css";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import UserTweets from "../components/UserTweets";
import profile from "../styles/assets/images/profile.png";
import FollowUser from "../components/FollowUser";
import UnfollowUser from "../components/UnfollowUser";
import SearchBar from "../components/SearchBar";

const User = () => {
  /**
   * @param user: view-only of user
   * @param loggedInUser: user logged in with auth params
   */

  const navigate = useNavigate();
  const { user } = useParams();
  const { auth } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [follower, setFollower] = useState([]);

  // Get user profile once page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/view/profile/${user}`);
        setDisplayName(response.data[0].display_name);
        setBio(response.data[0].bio);
        setLocation(response.data[0].location);
        setWebsite(response.data[0].website);
        setFollowerCount(response.data[0].follower.length);
        setFollowingCount(response.data[0].following.length);
        setFollower(response.data[0].follower);
      } catch (err) {
        console.error(`Profile: ${err}`);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      {user === auth?.user ? (
        <Navigate to="/profile" />
      ) : (
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
                {follower.includes(auth?.id) ? (
                  <UnfollowUser user={auth?.user} unfollowUser={user} />
                ) : (
                  <FollowUser user={auth?.user} followUser={user} />
                )}
              </div>

              <h3 className="profile-name">
                <p>{displayName}</p>
              </h3>
              <p>@{user}</p>
              {user ? (
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
            <UserTweets user={auth?.user} id={auth?.id} viewUser={user} />
          </div>
          <div className="right">
            <SearchBar />
          </div>
        </div>
      )}
    </>
  );
};

export default User;
