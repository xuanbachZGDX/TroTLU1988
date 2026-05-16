import React, { useEffect } from "react";
import icons from "../../../utils/icons";
import { Item } from "../../../components";
import ServicePriceTable from "../../../components/Post/ServicePriceTable";
import { priceList } from "../../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";

const { GrStar, AiFillCheckCircle } = icons;

const ServicePrice = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);

  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    dispatch(actions.getAllPostsLimit({
      limitPost: 50,
      order: "new"
    }));
    // Giả lập thời gian chờ load để tránh vòng xoay vô hạn
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const getExamplePost = (star) => {
    if (!posts || posts.length === 0) return null;
    const match = posts.find(post => +post?.star === +star);
    return match || posts[0];
  };

  if (!isLoaded && (!posts || posts.length === 0)) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang kết nối dữ liệu thực tế...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-10 py-10 px-4 bg-gray-50">
      <div className="w-full max-w-[1100px]">
        <ServicePriceTable />
      </div>

      <div className="w-full max-w-[1100px]">
        <h2 className="text-2xl font-bold mb-8 text-blue-800 uppercase text-center">So sánh giao diện các loại tin đăng</h2>
        <div className="flex flex-col gap-12">
          {priceList.map((item, index) => {
            const examplePost = getExamplePost(item.star);
            return (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
                <h3 className={`text-lg font-bold mb-4 ${item.color}`}>
                  {index + 1}. Minh họa {item.name}
                </h3>
                <div className="bg-white p-2 rounded-lg shadow-sm border border-dashed border-gray-300">
                  {examplePost ? (
                    <Item 
                      id={examplePost.id}
                      title={examplePost.title}
                      star={examplePost.star}
                      address={examplePost.address}
                      attributes={examplePost.attributes}
                      user={examplePost.user}
                      images={(() => {
                        try {
                          return JSON.parse(examplePost.images?.image);
                        } catch (e) {
                          return Array.isArray(examplePost.images?.image) ? examplePost.images?.image : [];
                        }
                      })()}
                      description={examplePost.description}
                      expired={(() => {
                        const now = new Date();
                        const days = +item.star === 5 ? 30 : +item.star === 4 ? 15 : +item.star === 3 ? 10 : +item.star === 2 ? 7 : 3;
                        now.setDate(now.getDate() + days);
                        return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                      })()}
                    />
                  ) : (
                    <div className="p-10 text-center text-gray-400 italic bg-gray-50 rounded-lg">
                      Hiện tại chưa có tin đăng mẫu cho gói {item.name} trong hệ thống.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-[1100px] text-center text-gray-500 text-sm mt-4">
        <p>* Lưu ý: Giá trên chỉ mang tính chất tham khảo cho đồ án. Hệ thống thanh toán sẽ được cập nhật sau.</p>
      </div>
    </div>
  );
};

export default ServicePrice;
