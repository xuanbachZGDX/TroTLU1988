import Swal from "sweetalert2";
import { path } from "./constant";

export const handleShareLink = (currentUrl) => {
  Swal.fire({
    title: "Chia sẻ tin đăng",
    text: "Đường dẫn tin đăng của bạn:",
    input: "text",
    inputValue: currentUrl,
    inputAttributes: {
      readonly: "true",
    },
    showCancelButton: true,
    confirmButtonText: "Sao chép Link",
    cancelButtonText: "Đóng",
    footer:
      '<span style="color: #666; font-size: 12px;">Bạn có thể copy link này để gửi cho bạn bè</span>',
    preConfirm: () => {
      navigator.clipboard.writeText(currentUrl);
      const toast = document.createElement("div");
      toast.innerText = "Đã sao chép link!";
      toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #333; color: #fff; padding: 10px 20px; border-radius: 20px;
        z-index: 9999; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: opacity 0.5s;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => document.body.removeChild(toast), 500);
      }, 1500);
      return false;
    },
  });
};

export const handleReportPost = (
  postId,
  isLoggedIn,
  navigate,
  apiCreateReport,
) => {
  if (!isLoggedIn) {
    Swal.fire({
      icon: "warning",
      title: "Yêu cầu đăng nhập",
      text: "Bạn cần đăng nhập để thực hiện chức năng báo cáo vi phạm.",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3b82f6",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/${path.LOGIN}`);
      }
    });
    return;
  }

  Swal.fire({
    title: "Báo cáo bài đăng vi phạm",
    input: "select",
    inputOptions: {
      "Lừa đảo, đặt cọc ảo": "Lừa đảo, đặt cọc ảo",
      "Phòng đã cho thuê": "Phòng đã cho thuê",
      "Sai thông tin, địa chỉ": "Sai thông tin, địa chỉ",
      "Ảnh không đúng thực tế": "Ảnh không đúng thực tế",
      "Lý do khác": "Lý do khác",
    },
    inputPlaceholder: "Chọn lý do báo cáo",
    showCancelButton: true,
    confirmButtonText: "Tiếp tục",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#3b82f6",
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value) resolve();
        else resolve("Bạn cần chọn một lý do");
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = result.value;
      Swal.fire({
        title: "Chi tiết báo cáo",
        input: "textarea",
        inputPlaceholder:
          "Mô tả chi tiết vi phạm (ví dụ: số điện thoại ảo, địa chỉ không đúng...)",
        showCancelButton: true,
        confirmButtonText: "Gửi báo cáo",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#ea580c",
      }).then(async (descResult) => {
        if (descResult.isConfirmed) {
          const content = descResult.value;
          try {
            const res = await apiCreateReport({ postId, reason, content });
            if (res?.data?.err === 0) {
              Swal.fire("Thành công", res.data.msg, "success");
            } else {
              Swal.fire(
                "Thất bại",
                res.data.msg || "Không thể gửi báo cáo",
                "error",
              );
            }
          } catch {
            Swal.fire(
              "Lỗi",
              "Gửi báo cáo thất bại, vui lòng thử lại.",
              "error",
            );
          }
        }
      });
    }
  });
};
