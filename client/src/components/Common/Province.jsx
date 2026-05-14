import React, { useEffect, useState } from "react";
import { ProvinceBtn } from "../index";
import { apiGetFeaturedProvinces } from "../../services/appService";

const locationImages = {
  "Hồ Chí Minh": "https://phongtro123.com/images/location_hcm.jpg",
  "Hà Nội": "https://phongtro123.com/images/location_hn.jpg",
  "Đà Nẵng": "https://phongtro123.com/images/location_dn.jpg",
  "Cần Thơ": "https://vcdn1-dulich.vnecdn.net/2022/04/13/vinh-can-tho-6007-1649823528.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=I9-VjKqD9pI6ZfMvUvS2-w",
  "Bình Dương": "https://vcdn1-kinhdoanh.vnecdn.net/2022/03/17/binh-duong-1647484432-6804-1647484542.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=m3mJ_Z9V7R9Y6G6C5S8_Xg",
  "Đồng Nai": "https://vcdn1-dulich.vnecdn.net/2022/05/25/bien-hoa-dong-nai-1653452656-7429-1653452668.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=v-vW-L2S8U3O4R5_Xg",
};

const defaultImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

const Province = () => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchFeaturedProvinces = async () => {
      const response = await apiGetFeaturedProvinces();
      if (response?.data?.err === 0) {
        setProvinces(response.data.response);
      }
    };
    fetchFeaturedProvinces();
  }, []);

  return (
    <div className="flex items-center gap-8 justify-center py-10 flex-wrap">
      {provinces.map((item) => (
        <ProvinceBtn 
          key={item.code} 
          code={item.code}
          image={locationImages[item.value] || defaultImage} 
          name={`Phòng trọ ${item.value}`} 
        />
      ))}
    </div>
  );
};

export default Province;
