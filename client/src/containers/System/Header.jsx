import React from "react";
import { Navigation } from "../Public";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full flex flex-none h-[54px]">
      <Link to="/" className="flex justify-center items-center font-bold bg-secondary1 text-white w-[256px] flex-none text-xl hover:text-gray-200 cursor-pointer border-r border-blue-600">
        Phongtro123.com
      </Link>
      <div className="flex-auto">
        <Navigation isAdmin={true} />
      </div>
    </div>
  );
};

export default Header;
