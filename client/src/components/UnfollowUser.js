import useAxiosPrivate from "../hooks/useAxiosPrivate";

/**
 * API consumes user with auth state (logged in) and unfollowUser as view-state user
 * @param user: loggedInUser
 * @param unfollowUser: user
 */

const UnfollowUser = ({ user, unfollowUser }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleUnfollow = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    const response = await axiosPrivate.post(
      "/unfollow",
      JSON.stringify({ user, unfollowUser }),
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
      <button onClick={handleUnfollow} className="edit-button">
        Unfollow
      </button>
    </div>
  );
};

export default UnfollowUser;
