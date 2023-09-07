import { useState } from "react";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { customStyles } from "../styles/CustomModalStyles";
import "../styles/tweetModal.css";
import "../styles/tweetButton.css";
import defaultProfile from "../styles/assets/images/default.png";

const Tweet = () => {
  const [text, setText] = useState("");
  const [char, setChar] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();
    const user = auth?.user;

    try {
      const response = await axiosPrivate.post(
        "/post/create",
        JSON.stringify({ user, text }),
        {
          signal: controller.signal,
        }
      );
      setText("");
      setModalIsOpen(false);
    } catch (err) {
      console.error(err.message);
    }

    refreshWindow();

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setText("");
    setChar(0);
    setModalIsOpen(false);
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <>
      <button className="tweet-button" onClick={openModal}>
        <span className="tweet-text">Tweet</span>
        <span className="tweet-icon">
          <i className="fa-regular fa-pen-to-square" />
        </span>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>

        <div className="tweetModal">
          <form onSubmit={handleSubmit}>
            <div className="tweetModal__input">
              <img
                src={defaultProfile}
                className="tweetModal__avatar"
                alt="avatar"
              />
              <label htmlFor="create" />
              <textarea
                style={{ height: "120px" }}
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
            <div className="tweetModal__footer">
              <p
                className={
                  char > 140
                    ? "tweetModal__charCountError"
                    : "tweetModal__charCount"
                }
              >
                {char} / 140
              </p>
              <button
                type="submit"
                className="tweetModal__tweetButton"
                disabled={char == 0 || char > 140 ? true : false}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Tweet;
