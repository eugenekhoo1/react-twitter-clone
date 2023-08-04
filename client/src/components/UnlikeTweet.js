import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UnlikeTweet = ({ user, tid, onUnlike }) => {
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

      onUnlike();
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
        <i
          className="fa-solid fa-heart"
          style={{ color: "#fa0000" }}
          aria-hidden="true"
        />
      </span>
    </>
  );
};

export default UnlikeTweet;
