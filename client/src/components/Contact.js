import React from "react";
import { text } from "../utils/dataContact";
import { Button } from "../components";

const Contact = () => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 w-1100 max-w-full flex flex-col justify-center items-center gap-6">
      <img
        src={text.image}
        alt="Liên hệ"
        className="w-full h-48 object-contain"
      />
      <p>{text.content}</p>
      <div className="flex items-center justify-around w-full">
        {text.contact.map((item, index) => {
          return (
            <div key={index} className="flex flex-col items-center justify-center">
              <span className="text-orange-700 font-bold">{item.text}</span>
              <span className="text-blue-900 text-[24px] font-bold">
                {item.phone}
              </span>
              <span className="text-blue-900 text-[24px] font-bold">
                {item.zalo}
              </span>
            </div>
          );
        })}
      </div>
      <Button
        text="Gửi liên hệ"
        bgColor="bg-blue-600"
        textColor="text-white"
        px="px-6"
      />
    </div>
  );
};

export default Contact;
