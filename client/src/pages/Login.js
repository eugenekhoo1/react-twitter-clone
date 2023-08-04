import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import logo from "../styles/assets/images/logo.png";
import "../styles/login.css";

const Login = () => {
  const errRef = useRef();
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Logging in...");
      const response = await axios.post(
        "/login",
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const accessToken = response?.data?.accessToken;
        const id = response?.data?.id;
        setAuth({ user, pwd, accessToken, id });
        setUser("");
        setPwd("");
        navigate("/profile");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Username does not exist");
      } else if (err.response?.status === 401) {
        setErrMsg("Incorrect username and password combination");
      } else if (err.response?.status === 500) {
        setErrMsg("Login Failed");
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="container">
      <h3>
        <img src={logo} className="loginLogo" alt="logo" />
        <br />
        Log in
      </h3>
      <section>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              className="form"
              type="text"
              id="username"
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              className="form"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button type="submit" className="login-button">
              <span>Login</span>
            </button>
            <div className="persistCheck">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">Trust Device?</label>
            </div>
          </form>
          <div className="register">
            <h4>Don't have an account?</h4>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
