import useAxiosPrivate from "../hooks/useAxiosPrivate";

const LikeTweet = ({ user, tid, onLike }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleLike = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post(
        "/like",
        JSON.stringify({ user, tid }),
        { signal: controller.signal }
      );

      onLike();
    } catch (err) {
      console.error(err);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <>
      <span onClick={handleLike} style={{ marginRight: "5px" }}>
        <i className="fa-regular fa-heart" aria-hidden="true" alt="Like" />
      </span>
    </>
  );
};

export default LikeTweet;
