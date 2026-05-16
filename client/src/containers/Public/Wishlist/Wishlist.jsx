import React, { useEffect, useState } from "react";
import { Item } from "../../../components";
import { apiGetPostById } from "../../../services";

const Wishlist = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const savedIds = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (savedIds.length > 0) {
        setIsLoading(true);
        try {
          const results = await Promise.all(
            savedIds.map((id) => apiGetPostById(id))
          );
          const validPosts = results
            .filter((res) => res?.data?.err === 0)
            .map((res) => res.data.response);
          setPosts(validPosts);
        } catch (error) {
          console.error("Failed to fetch wishlist posts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tin đã lưu</h1>
        <p className="text-gray-500">Danh sách các bài đăng bạn đã lưu để xem lại sau.</p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((item) => {
            let images = [];
            try {
              images = JSON.parse(item?.images?.image || "[]");
            } catch (error) {
              images = [];
            }
            const getDescription = (desc) => {
              try {
                return JSON.parse(desc);
              } catch (e) {
                return desc ? [desc] : [];
              }
            };

            return (
              <Item
                key={item.id}
                id={item.id}
                address={item.address}
                attributes={item.attributes}
                description={getDescription(item.description)}
                images={images}
                star={item.star}
                title={item.title}
                user={item.user}
              />
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center gap-4">
            <div className="bg-gray-50 p-4 rounded-full">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Bạn chưa lưu bài đăng nào.</p>
            <a href="/" className="text-blue-600 font-bold hover:underline">Tìm tin ngay</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
