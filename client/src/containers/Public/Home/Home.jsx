import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Navigation, Search } from "../index";
import { Intro, Contact, Footer } from "../../../components";
import { path } from "../../../utils/constant";

const Home = () => {
  const location = useLocation();

  return (
    <div className="w-full flex gap-6 flex-col items-center h-full">
      <Header />
      <Navigation />
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
