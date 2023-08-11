import { useState, useEffect } from "react";
import Modal from "react-modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/moreModal.css";

const MoreModal = ({ user, tid, tweetAuthor, retweeted }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({});

  const axiosPrivate = useAxiosPrivate();

  const handleEdit = async () => {};

  const handleDelete = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post(
        "/post/delete",
        JSON.stringify({ user, tid }),
        { signal: controller.signal }
      );
    } catch (err) {
      console.error(err);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const openModal = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    console.log(mouseX);
    e.preventDefault();
    setModalStyle({
      content: {
        position: "fixed",
        width: "max-content",
        height: "max-content",
        background: "#fff",
        borderRadius: "25px",
        top: mouseY,
        left: mouseX,
      },
      overlay: {
        backgroundColor: "rgba(255,255,255,0)",
      },
    });
    setModalIsOpen(true);
  };

  const closeModal = (e) => {
    e.preventDefault();
    setModalIsOpen(false);
  };

  return (
    <>
      <button className="button-more" onClick={openModal}>
        <i class="fa fa-ellipsis" />
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={modalStyle}
      >
        <div className="container-more">
          {user === tweetAuthor || retweeted ? (
            <>
              <div className="container-row-more" onClick={handleEdit}>
                <i className="fa-solid fa-pen-to-square" />
                <span>Edit Tweet</span>
              </div>
              <div className="container-row-more" onClick={handleDelete}>
                <i className="fa-solid fa-trash" />
                <span>Delete Tweet</span>
              </div>
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default MoreModal;
