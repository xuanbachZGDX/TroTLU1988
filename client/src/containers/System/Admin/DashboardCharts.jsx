import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardCharts = ({ chartData = [] }) => {
  // Cấu hình biểu đồ Doanh thu (Area Line Chart)
  const revenueChartData = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: chartData.map((d) => d.revenue),
        borderColor: "#ea580c", // Cam đậm nổi bật (orange-600)
        backgroundColor: "rgba(234, 88, 12, 0.12)", // Lớp phủ gradient cam nhạt sang trọng
        borderWidth: 4, // Đường line dày nổi bật
        pointBackgroundColor: "#ea580c",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointRadius: 6, // Điểm nút to dễ nhìn, dễ tương tác
        pointHoverRadius: 9,
        tension: 0.35, // Độ cong cubic spline hoàn hảo
        fill: true,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn legend vì chỉ có một đường biểu đồ duy nhất
      },
      tooltip: {
        backgroundColor: "#1e293b", // Slate-800 sang trọng
        titleFont: { family: "Inter, sans-serif", size: 13, weight: "bold" },
        bodyFont: { family: "Inter, sans-serif", size: 13 },
        padding: 12,
        cornerRadius: 10,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            return ` 💰 Doanh thu: ${context.raw.toLocaleString("vi-VN")} VNĐ`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9", // Grid line ngang siêu mảnh màu nhạt
        },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11, weight: "600" },
          color: "#64748b",
          precision: 0,
          // Định dạng tiền tệ đầy đủ có chấm phân cách phần nghìn
          callback: (value) => {
            return value.toLocaleString("vi-VN") + " đ";
          },
        },
      },
      x: {
        grid: {
          display: false, // Ẩn grid dọc cho biểu đồ thoáng mắt cực kỳ
        },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11, weight: "bold" },
          color: "#475569",
        },
      },
    },
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 transition-all hover:shadow-md hover:border-slate-200 w-full">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">Báo cáo tài chính</span>
        <h3 className="text-xl font-black text-slate-800 mt-3 flex items-center gap-2">
          📈 Tổng doanh thu hệ thống qua các tháng (VNĐ)
        </h3>
        <p className="text-sm text-slate-400 mt-1">Biểu đồ dòng tiền thực tế thu được từ các giao dịch nạp tiền vào ví của khách hàng và phí kích hoạt tin đăng thuê trên nền tảng.</p>
      </div>
      {/* Chiều cao 500px siêu thoáng, căn rộng 100% trang */}
      <div className="h-[480px] w-full mt-2">
        <Line data={revenueChartData} options={revenueChartOptions} />
      </div>
    </div>
  );
};

export default DashboardCharts;
