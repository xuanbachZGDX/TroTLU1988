import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { path } from "../../utils/constant";
import SystemSidebar from "./SystemSidebar";
import { Navigation } from "../Public";
import * as actions from "../../store/actions";

const SystemLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(actions.getCurrent());
    }
  }, [location.pathname, isLoggedIn, dispatch]);

  if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />;

  const isKycPage = location.pathname.includes(path.USER_KYC);
  const showBanner = currentData && currentData.role !== "admin" && !isKycPage;
  const kycStatus = currentData?.kycStatus || "unverified";

  return (
    <div className="w-full h-screen flex flex-col items-center bg-slate-50">
      <div className="w-full flex-none">
        <Navigation showLogo={true} />
      </div>
      <div className="flex w-full flex-auto overflow-hidden">
        <SystemSidebar />
        <div className="flex-auto h-full overflow-y-scroll scroll-smooth scroll-pt-32 bg-gray-50 flex flex-col items-center">
          <div className="w-full max-w-[1300px] px-4 md:px-6 pb-12 pt-6">
            {/* KYC Alert Banners */}
            {showBanner && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-sm border transition-all duration-200">
                {kycStatus === "unverified" && (
                  <div className="flex items-center justify-between flex-wrap gap-3 text-amber-800 bg-amber-50 border-amber-200 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚠️</span>
                      <p className="text-sm font-medium">
                        <strong>
                          Tài khoản chưa xác minh danh tính (KYC):
                        </strong>{" "}
                        Vui lòng xác minh thông tin tài khoản để nhận huy hiệu
                        uy tín xanh và tăng mức độ tin cậy đối với khách thuê
                        phòng.
                      </p>
                    </div>
                    <Link
                      to={`/${path.SYSTEM}/${path.USER_KYC}`}
                      className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      Xác minh ngay →
                    </Link>
                  </div>
                )}

                {kycStatus === "pending" && (
                  <div className="flex items-center gap-3 text-blue-800 bg-blue-50 border-blue-200 p-4">
                    <span className="text-xl">⏳</span>
                    <p className="text-sm font-medium">
                      <strong>Đang chờ xét duyệt:</strong> Yêu cầu xác minh danh
                      tính (KYC) của bạn đã được gửi thành công và đang được
                      Admin xem xét. Vui lòng chờ kết quả phê duyệt.
                    </p>
                  </div>
                )}

                {kycStatus === "rejected" && (
                  <div className="flex items-center justify-between flex-wrap gap-3 text-red-800 bg-red-50 border-red-200 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">❌</span>
                      <div className="text-sm">
                        <p className="font-semibold">
                          Yêu cầu xác minh danh tính bị từ chối!
                        </p>
                        <p className="text-xs mt-1">
                          Lý do từ chối:{" "}
                          <span className="italic font-medium text-red-700">
                            "
                            {currentData?.kycNote ||
                              "Thông tin hoặc hình ảnh CCCD không hợp lệ"}
                            "
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/${path.SYSTEM}/${path.USER_KYC}`}
                      className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      Gửi lại yêu cầu →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLayout;
