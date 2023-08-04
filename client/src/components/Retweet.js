import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Retweet = ({ user, id, tid, text, onRetweet }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleRetweet = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post(
        "/retweet",
        JSON.stringify({ user, id, tid, text }),
        { signal: controller.signal }
      );

      onRetweet();
      // refreshWindow();
    } catch (err) {
      console.error(err);
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
    <>
      <span onClick={handleRetweet} style={{ marginRight: "5px" }}>
        <i className="fa-solid fa-retweet" aria-hidden="true" alt="Retweet" />
      </span>
    </>
  );
};

export default Retweet;
