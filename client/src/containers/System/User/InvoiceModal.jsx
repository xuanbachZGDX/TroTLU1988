import React from "react";
import moment from "moment";
import html2pdf from "html2pdf.js";

const InvoiceModal = ({ isOpen, onClose, tx, userName }) => {
  if (!isOpen || !tx) return null;

  const formattedAmount = tx.amount?.toLocaleString("vi-VN");
  const formattedDate = moment(tx.createdAt).format("DD/MM/YYYY HH:mm:ss");
  const typeLabel =
    tx.type === "deposit"
      ? "Nạp tiền vào ví"
      : tx.type === "refund"
        ? "Hoàn tiền vào ví"
        : "Thanh toán phí dịch vụ";
  const typeColor =
    tx.type === "deposit" || tx.type === "refund"
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : "text-rose-600 bg-rose-50 border-rose-200";
  const amountColor =
    tx.type === "deposit" || tx.type === "refund"
      ? "text-emerald-600"
      : "text-rose-600";
  const amountSign = tx.type === "deposit" || tx.type === "refund" ? "+" : "-";
  const customerName = userName || "Khách hàng hệ thống";

  const handlePrint = () => {
    const element = document.getElementById("print-invoice-area");
    const opt = {
      margin: 10,
      filename: `Bien_lai_TroTLU1988_${tx.id.slice(0, 8).toUpperCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto no-print-backdrop">
      {/* Inject print styles locally when modal is open */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible !important;
          }
          #print-invoice-area {
            position: absolute !important;
            left: 50% !important;
            top: 0 !important;
            transform: translateX(-50%) !important;
            width: 680px !important;
            margin: 0 !important;
            padding: 30px !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `,
        }}
      />

      <div className="flex min-h-full items-center justify-center p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 transform transition-all animate-fade-in no-print-modal">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center no-print">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              📄 Biên lai giao dịch #${tx.id.slice(0, 8).toUpperCase()}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Invoice Body (The printed area) */}
          <div id="print-invoice-area" className="p-8 bg-white text-gray-800">
            <div className="flex justify-between items-start border-b border-blue-500 pb-5 mb-6">
              <div>
                <div className="text-2xl font-extrabold text-blue-700 tracking-tight">
                  TroTLU1988<span className="text-blue-400">.com</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-gray-500 leading-relaxed max-w-[240px]">
                <strong className="text-gray-700">
                  KÊNH THÔNG TIN PHÒNG TRỌ HÀNG ĐẦU
                </strong>
                <br />
                Website: www.trotlu1988.com
                <br />
                Hotline: 1900 1234
                <br />
                Email: support@trotlu1988.com
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-6 uppercase tracking-wider">
              Biên Lai Xác Nhận Giao Dịch
            </h2>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mã giao dịch
                </span>
                <span className="font-mono font-semibold text-slate-700 break-all">
                  {tx.id}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Thời gian
                </span>
                <span className="font-medium text-slate-700">
                  {formattedDate}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Khách hàng thực hiện
                </span>
                <span className="font-bold text-blue-700">{customerName}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-gray-200 py-4 mb-6 text-sm flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">
                  Loại giao dịch:
                </span>
                <span className="font-semibold text-gray-800">{typeLabel}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium">
                  Nội dung thanh toán:
                </span>
                <span className="font-semibold text-gray-800 text-right max-w-[280px]">
                  {tx.content}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">
                  Trạng thái hệ thống:
                </span>
                <span className="font-bold text-emerald-600">Thành công</span>
              </div>
            </div>

            <div
              className={`flex justify-between items-center p-4 rounded-xl mb-8 border ${typeColor}`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                Số tiền giao dịch
              </span>
              <span className={`text-2xl font-black ${amountColor}`}>
                {amountSign}
                {formattedAmount} đ
              </span>
            </div>

            <div className="flex justify-between mt-8 relative">
              <div className="text-center w-[180px]">
                <span className="font-bold text-xs uppercase text-gray-600 block mb-14">
                  Khách hàng
                </span>
                <span className="font-bold text-xs text-gray-800 block">
                  {customerName}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  (Ký và ghi rõ họ tên)
                </span>
              </div>

              <div className="text-center w-[180px] relative">
                <span className="font-bold text-xs uppercase text-gray-600 block mb-14">
                  Đại diện TroTLU1988.com
                </span>
                <span className="font-bold text-xs text-gray-800 block">
                  Ban Quản Trị TroTLU1988
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Hệ thống hóa đơn điện tử
                </span>

                {/* Electronic Stamp */}
                <div className="absolute top-[20px] left-[50%] transform -translate-x-1/2 -rotate-12 border-4 double border-red-500 text-red-500 font-black text-xs px-3 py-1.5 rounded-lg tracking-widest uppercase bg-white/90 select-none shadow-sm pointer-events-none">
                  ĐÃ THANH TOÁN
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
              Cảm ơn quý khách đã sử dụng dịch vụ tại TroTLU1988.com!
              <br />
              Hóa đơn điện tử được xác thực và bảo mật tự động trên hệ thống.
            </div>
          </div>

          {/* Modal Footer (Buttons) */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 transition-colors shadow-sm"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center gap-1.5 animate-pulse-subtle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Lưu file PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
