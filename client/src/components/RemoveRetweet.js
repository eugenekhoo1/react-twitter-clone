import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RemoveRetweet = ({ user, id, tid, text, onRemoveRetweet }) => {
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

      onRemoveRetweet();
      refreshWindow();
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
        <i
          className="fa-solid fa-retweet"
          style={{ color: "#09d360" }}
          aria-hidden="true"
          alt="Retweet"
        />
      </span>
    </>
  );
};

export default RemoveRetweet;
