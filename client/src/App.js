import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import User from "./pages/User";
import SingleTweet from "./pages/SingleTweet";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>

      <Routes>
        <Route element={<PersistLogin />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/:user" element={<User />} />
          <Route path="/tid/:tid" element={<SingleTweet />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
