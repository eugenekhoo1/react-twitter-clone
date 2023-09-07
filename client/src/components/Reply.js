import { useState } from "react";
import { formatDistance, subDays } from "date-fns";
import Modal from "react-modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { customStyles } from "../styles/CustomModalStyles";
import "../styles/tweetModal.css";
import defaultProfile from "../styles/assets/images/default.png";
import { Link } from "react-router-dom";

const Reply = ({
  user,
  tid,
  replyUser,
  replyText,
  replyCreatedAt,
  onReply,
}) => {
  const [text, setText] = useState("");
  const [char, setChar] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleReply = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post(
        "/post/reply",
        JSON.stringify({ user, text, tid }),
        {
          signal: controller.signal,
        }
      );
      setText("");
      setModalIsOpen(false);
      onReply();
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
      <i className="fa-regular fa-comment" onClick={openModal} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
        <div className="reply-container">
          <div className="reply-header">
            <img
              src={defaultProfile}
              className="replyModal__avatar"
              alt="avatar"
            />
            <Link to={`/user/${replyUser}`}>
              <h4 className="name">{replyUser}</h4>
            </Link>
            <p className="date-time">
              {formatDistance(subDays(new Date(replyCreatedAt), 0), new Date())}{" "}
              ago
            </p>
          </div>
          <p className="text__reply">{replyText}</p>
        </div>
        <div className="tweetModal">
          <form onSubmit={handleReply}>
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
                placeholder="Tweet your reply!"
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
                Reply
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Reply;
