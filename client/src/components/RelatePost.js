import React, { useEffect } from "react";
import { SmallItem } from "./index";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";

const RelatePost = () => {
  const { newPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getNewPosts());
  }, [dispatch]);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-base mb-1 pb-2 border-b border-gray-100">
        Tin mới đăng
      </h3>
      <div className="w-full flex flex-col">
        {newPosts?.map((item) => (
          <SmallItem
            key={item.id}
            id={item.id}
            title={item.title}
            price={item?.attributes?.price}
            createdAt={item.createdAt}
            image={JSON.parse(item.images.image)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatePost;
