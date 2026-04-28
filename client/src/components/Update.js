import React from "react";
import { CreatePost } from "../containers/System";

const Update = ({ setIsEdit }) => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => {
        e.stopPropagation();
        setIsEdit(false);
      }}
    >
      <div 
        className="bg-white max-w-5xl w-full h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <span 
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500 text-3xl font-bold p-2 leading-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsEdit(false);
          }}
          title="Đóng"
        >
          &times;
        </span>
        <CreatePost isEdit={true} setIsEdit={setIsEdit} />
      </div>
    </div>
  );
};

export default Update;
