import "../styles/tweet.css";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import profile from "../styles/assets/images/profile.png";

const HomePageTweet = ({ user }) => {
  const [char, setChar] = useState(0);
  const [text, setText] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post(
        "/post/create",
        JSON.stringify({ user, text }),
        {
          signal: controller.signal,
        }
      );
      setText("");
      setChar(0);
      refreshWindow();
    } catch (err) {
      console.error(err.message);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handleSubmit}>
        <div className="tweetBox__input">
          <img src={profile} className="tweetBox__avatar" alt="avatar" />
          <label htmlFor="create" />
          <textarea
            type="text"
            id="create"
            onChange={(e) => {
              setText(e.target.value);
              setChar(e.target.value.length);
            }}
            value={text}
            required
            placeholder="What's happening..."
          />
        </div>
        <p className={char > 140 ? "charCount__error" : "charCount"}>
          {char} / 140
        </p>
        <button
          type="submit"
          className="tweetBox__tweetButton"
          disabled={char == 0 || char > 140 ? true : false}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default HomePageTweet;
