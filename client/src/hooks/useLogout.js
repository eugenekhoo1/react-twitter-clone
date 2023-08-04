import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    console.log("useLogout..", auth);
    setAuth({});
    console.log(`useLogout: ${auth}`);
    try {
      const response = await axios.get("/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
