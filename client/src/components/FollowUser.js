import useAxiosPrivate from "../hooks/useAxiosPrivate";

/**
 * API consumes user with auth state (logged in) and followUser as view-state user
 * @param user: loggedInUser
 * @param followUser: user
 */

const FollowUser = ({ user, followUser }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleFollow = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    console.log("FollowUser API", user, followUser);
    const response = await axiosPrivate.post(
      "/follow",
      JSON.stringify({ user, followUser }),
      { signal: controller.signal }
    );

    refreshWindow();

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <div>
      <button onClick={handleFollow} className="edit-button">
        Follow
      </button>
    </div>
  );
};

export default FollowUser;
