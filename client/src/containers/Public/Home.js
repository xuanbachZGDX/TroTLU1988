import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Navigation, Search } from "./index";
import { Intro, Contact } from "../../components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { path } from "../../utils/constant";

const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div className="w-full flex gap-6 flex-col items-center h-full">
      <Header />
      <Navigation />
      {isLoggedIn &&  location.pathname !== `/${path.CONTACT}` && <Search />}
      <div className="w-1100 max-w-full flex flex-col items-start justify-start mt-3 px-4 md:px-0">
        <Outlet />
      </div>
      <Intro />
      <Contact />
      <div className="h-[500px]"></div>
    </div>
  );
};

export default Home;
