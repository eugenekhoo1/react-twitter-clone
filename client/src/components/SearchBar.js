import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import "../styles/searchBar.css";

const SearchBar = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    const getProfiles = async () => {
      const response = await axios.get("/search/profiles");
      setProfiles(response.data);
    };

    getProfiles();
  }, []);

  const handleFilter = (e) => {
    const searchText = e.target.value;
    const newFilter = profiles.filter((profile) => {
      return profile.username.toLowerCase().includes(searchText.toLowerCase());
    });

    if (searchText === "") {
      setFilteredProfiles([]);
    } else {
      setFilteredProfiles(newFilter);
    }
  };

  return (
    <>
      <div className="search-bar-container">
        <i
          className="fa fa-magnifying-glass"
          style={{ paddingTop: "4px", paddingLeft: "4px" }}
        />
        <label htmlFor="search-input">
          <input
            className="search-bar-input"
            placeholder="Search"
            name="search-input"
            autoComplete="off"
            onChange={handleFilter}
          />
        </label>
      </div>
      {filteredProfiles.length === 0 ? null : (
        <div className="search-results">
          {filteredProfiles.map((profile) => (
            <Link to={`/user/${profile.username}`} className="search-item">
              <p>{profile.display_name}</p>
              <p>@{profile.username}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchBar;
