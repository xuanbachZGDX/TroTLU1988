import React from "react";
import PostNavigation from "./PostNavigation";
import icons from "../../../../utils/icons";

const { GrLinkPrevious } = icons;

const CreatePostHeader = ({
  step,
  setStep,
  isEdit,
  activeTab,
  handleScrollToSection,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="px-10 pt-6 pb-0">
        <div className="flex items-center gap-4 mb-6">
          {step === 2 && (
            <span
              onClick={() => setStep(1)}
              className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <GrLinkPrevious size={24} />
            </span>
          )}
          <h1 className="text-[28px] font-semibold text-gray-800">
            {step === 2 ? "Thanh toán" : isEdit ? "Cập nhật" : "Đăng tin"}
          </h1>
        </div>
        {step === 1 && (
          <PostNavigation
            activeTab={activeTab}
            handleScrollToSection={handleScrollToSection}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostHeader;
