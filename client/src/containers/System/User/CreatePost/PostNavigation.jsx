import React from "react";

const PostNavigation = ({ activeTab, handleScrollToSection }) => {
  const tabs = [
    { id: 'khu-vuc', label: 'Khu vực' },
    { id: 'thong-tin-mo-ta', label: 'Thông tin mô tả' },
    { id: 'hinh-anh', label: 'Hình ảnh' },
    { id: 'thong-tin-lien-he', label: 'Thông tin liên hệ' },
  ];

  return (
    <div className="flex items-center gap-6 text-[14px] font-medium text-gray-500">
      {tabs.map(tab => (
        <a 
          key={tab.id}
          href={`#${tab.id}`} 
          onClick={(e) => handleScrollToSection(e, tab.id)}
          className={`${activeTab === tab.id ? 'text-orange-500 border-orange-500' : 'hover:text-orange-500 border-transparent'} border-b-2 pb-3 transition-all cursor-pointer`}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
};

export default PostNavigation;
