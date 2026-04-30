import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Navigation, Search } from "./index";
import { Intro, Contact, Footer } from "../../components";
import { useLocation } from "react-router-dom";
import { path } from "../../utils/constant";

const Home = () => {
  const location = useLocation();

  return (
    <div className="w-full flex gap-6 flex-col items-center h-full">
      <Header />
      <Navigation />
      {location.pathname !== `/${path.CONTACT}` &&
        location.pathname !== `/${path.LOGIN}` &&
        !location.pathname.includes(path.DETAIL) && <Search />}
      <div className="w-1100 max-w-full flex flex-col items-start justify-start mt-3 px-4 md:px-0">
        <Outlet />
      </div>
      <Intro />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
