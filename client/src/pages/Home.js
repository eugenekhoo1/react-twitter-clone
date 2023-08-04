import LeftNav from "../components/LeftNav";
import HomePageTweet from "../components/HomePageTweet";
import HomeFeed from "../components/HomeFeed";
import useAuth from "../hooks/useAuth";
import "../styles/home.css";
import "../styles/primary.css";

const Home = () => {
  const { auth } = useAuth();
  const user = auth?.user;
  const id = auth?.id;
  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav user={user} />
        </div>
        <div className="home">
          <div className="home-header">
            <h3 className="home-title">Home</h3>
          </div>
          <HomePageTweet user={user} />
          <HomeFeed user={user} id={id} />
        </div>
        <div className="right"></div>
      </div>
    </>
  );
};

export default Home;
