import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import logo from "../styles/assets/images/logo.png";
import "../styles/login.css";
import "../styles/register.css";

const USER_REGEX = /^[a-zA-Z0-9-_]{4,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);

    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = USER_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      console.log("Client: Creating account...");

      const response = await axios.post(
        "/register",
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("User created!");
        setSuccess(true);
        setUser("");
        setPwd("");
        setMatchPwd("");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  return (
    <div className="container">
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/login">Log In</Link>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div className="container">
            <h3>
              <img
                src={logo}
                alt="logo"
                style={{ width: "50px", height: "50px" }}
                className="registerLogo"
              />
              <br />
              Sign up
            </h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username" className="form-label">
                Username:
                <span className={validName ? "valid " : "hide"}>
                  <i className="bi bi-check" color="green"></i>
                </span>
                <span className={validName || !user ? "hide" : "invalid"}>
                  <i className="bi bi-x" color="red"></i>
                </span>
              </label>
              <input
                className="form"
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName ? "instructions" : "offscreen"
                }
              >
                <i className="bi bi-info-circle" />4 to 24 characters
              </p>

              <label htmlFor="password" className="form-label">
                Password:
                <span className={validPwd ? "valid " : "hide"}>
                  <i className="bi bi-check" color="green"></i>
                </span>
                <span className={validPwd || !user ? "hide" : "invalid"}>
                  <i className="bi bi-x" color="red"></i>
                </span>
              </label>
              <input
                className="form"
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
              >
                <i className="bi bi-info-circle" />
                8 to 24 characters
                <br />
                At least one number (0-9)
                <br />
                At least one uppercase (A-Z)
                <br />
                At least one lowercase (a-z)
              </p>

              <label htmlFor="confirm_pwd" className="form-label">
                Confirm Password:
                <span className={validMatch && matchPwd ? "valid " : "hide"}>
                  <i className="bi bi-check" color="green"></i>
                </span>
                <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                  <i className="bi bi-x" color="red"></i>
                </span>
              </label>
              <input
                className="form"
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                id="confirm_pwd"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <i className="bi bi-info-circle" />
                Passwords must match!
              </p>

              <button
                className="login-button"
                disabled={!validName || !validPwd || !validMatch ? true : false}
              >
                <span>Sign up</span>
              </button>
            </form>
            <div className="register">
              <h4>Already have an account?</h4>
              <Link to="/login">Log In</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Register;
