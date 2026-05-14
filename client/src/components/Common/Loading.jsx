import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loading = () => {
  return (
    <div>
      <ColorRing
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8']}
      />
    </div>
  );
};

export default Loading;
