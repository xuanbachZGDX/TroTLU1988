import React, { useEffect, useState } from "react";
import { apiGetAdminTransactions } from "../../../services";
import { PaginationAdmin } from "../../../components";
import Swal from "sweetalert2";
import icons from "../../../utils/icons";
import InvoiceModal from "../User/InvoiceModal.jsx";
import TransactionFilters from "./TransactionFilters";
import TransactionRow from "./TransactionRow";

const { BsWallet2 } = icons;

const AdminManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({ search: "", type: "", status: "" });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "",
    status: "",
  });

  // Invoice Modal State
  const [selectedTx, setSelectedTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await apiGetAdminTransactions({
        page,
        limit,
        ...appliedFilters,
      });
      if (response?.data?.err === 0) {
        setTransactions(response.data.response.rows || []);
        setCount(response.data.response.count || 0);
      } else {
        Swal.fire(
          "Lỗi!",
          response?.data?.msg || "Không thể tải danh sách giao dịch",
          "error",
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Swal.fire("Lỗi!", "Có lỗi kết nối hệ thống", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, appliedFilters]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const reset = { search: "", type: "", status: "" };
    setFilters(reset);
    setPage(1);
    setAppliedFilters(reset);
  };

  const handleOpenInvoice = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(count / limit));

  return (
    <div className="flex flex-col gap-6 pb-20 w-full max-w-[1200px] mx-auto p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <BsWallet2 className="text-blue-600" /> Quản lý giao dịch toàn hệ
            thống
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Theo dõi, tra cứu lịch sử nạp tiền, trừ phí đăng tin VIP và hoàn
            tiền của mọi chủ trọ.
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
          <span className="text-blue-600 font-bold text-lg">{count}</span>
          <span className="text-blue-400 text-sm font-medium">giao dịch</span>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Mã giao dịch</th>
                <th className="px-6 py-4">Chủ trọ</th>
                <th className="px-6 py-4">Loại GD</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4 text-right">Số tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-b-transparent"></div>
                      <span>Đang tải dữ liệu giao dịch...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-gray-500 font-medium"
                  >
                    Không tìm thấy giao dịch nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    onOpenInvoice={handleOpenInvoice}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-400 italic">
          Tìm thấy <span className="font-bold text-blue-600">{count}</span> giao
          dịch
        </p>
        {totalPages > 1 && (
          <PaginationAdmin
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* Detail Invoice Modal */}
      {selectedTx && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTx(null);
          }}
          tx={selectedTx}
          userName={selectedTx.user?.name || "Chủ trọ"}
        />
      )}
    </div>
  );
};

export default AdminManageTransactions;
