import React from "react";

const FeaturesSection = ({ allFeatures, payload, setPayload }) => {
  return (
    <div id="dac-diem-noi-bat" className="scroll-mt-40 bg-white rounded-md shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-6">Đặc điểm nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(allFeatures || []).map((item) => (
          <label key={item.code} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-blue-600" 
              checked={payload.features?.includes(item.value) || false}
              onChange={(e) => setPayload(prev => ({ 
                ...prev, 
                features: e.target.checked 
                  ? [...(prev.features || []), item.value] 
                  : (prev.features || []).filter(f => f !== item.value) 
              }))} 
            />
            <span className="text-sm">{item.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
