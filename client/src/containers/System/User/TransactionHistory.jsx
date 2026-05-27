import React, { useEffect, useState } from 'react';
import { apiGetTransactionHistory } from '../../../services';
import moment from 'moment';
import icons from '../../../utils/icons';

const { MdHistory } = icons;

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiGetTransactionHistory();
                if (response?.data?.err === 0) {
                    setTransactions(response.data.response);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handlePrintInvoice = (tx) => {
        const printWindow = window.open("", "_blank", "width=800,height=900");
        const formattedAmount = tx.amount?.toLocaleString('vi-VN');
        const formattedDate = moment(tx.createdAt).format('DD/MM/YYYY HH:mm:ss');
        const typeLabel = tx.type === 'deposit' ? 'Nạp tiền vào ví' : tx.type === 'refund' ? 'Hoàn tiền vào ví' : 'Thanh toán phí dịch vụ';
        const typeColor = tx.type === 'deposit' || tx.type === 'refund' ? '#16a34a' : '#dc2626';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Biên lai giao dịch #${tx.id.slice(0, 8).toUpperCase()}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 40px; background-color: #fff; }
                        .invoice-container { max-width: 680px; margin: 0 auto; border: 2px dashed #3b82f6; padding: 30px; border-radius: 12px; position: relative; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 26px; font-weight: 800; color: #1d4ed8; text-transform: uppercase; letter-spacing: 1px; }
                        .title { font-size: 22px; font-weight: bold; text-align: center; color: #111827; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
                        .section { margin-bottom: 25px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; line-height: 1.6; }
                        .row-label { font-weight: bold; color: #4b5563; }
                        .row-value { text-align: right; color: #111827; font-weight: 500; }
                        .amount-row { display: flex; justify-content: space-between; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 25px 0; }
                        .amount-label { font-size: 16px; font-weight: bold; color: #166534; }
                        .amount-value { font-size: 22px; font-weight: bold; color: ${typeColor}; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; line-height: 1.6; }
                        .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; }
                        .signature-box { text-align: center; width: 220px; position: relative; }
                        .signature-title { font-weight: bold; font-size: 14px; margin-bottom: 60px; color: #1f2937; }
                        .signature-name { font-style: italic; color: #4b5563; font-size: 13px; }
                        .stamp { position: absolute; top: 25px; right: 20px; font-weight: bold; color: #dc2626; border: 3px double #dc2626; padding: 5px 12px; transform: rotate(-10deg); border-radius: 6px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; background-color: rgba(255, 255, 255, 0.9); }
                        @media print {
                            body { padding: 0; background: none; }
                            .invoice-container { border: none; padding: 0; box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-container">
                        <div class="header">
                            <div class="logo">PhongTro123</div>
                            <div style="text-align: right; font-size: 12px; color: #4b5563; line-height: 1.5;">
                                <strong>KÊNH THÔNG TIN PHÒNG TRỌ SỐ 1 VIỆT NAM</strong><br/>
                                Website: www.phongtro123.com<br/>
                                Hotline: 1900 1234 - Support: hotro@phongtro123.com
                            </div>
                        </div>
                        
                        <div class="title">Biên Lai Xác Nhận Giao Dịch</div>
                        
                        <div class="section">
                            <div class="row">
                                <span class="row-label">Mã giao dịch:</span>
                                <span class="row-value" style="font-family: monospace; font-size: 15px; font-weight: bold; color: #1e3a8a;">${tx.id}</span>
                            </div>
                            <div class="row">
                                <span class="row-label">Thời gian giao dịch:</span>
                                <span class="row-value">${formattedDate}</span>
                            </div>
                            <div class="row">
                                <span class="row-label">Loại giao dịch:</span>
                                <span class="row-value">${typeLabel}</span>
                            </div>
                            <div class="row">
                                <span class="row-label">Nội dung:</span>
                                <span class="row-value" style="max-width: 420px; display: inline-block;">${tx.content}</span>
                            </div>
                            <div class="row">
                                <span class="row-label">Trạng thái:</span>
                                <span class="row-value" style="color: #16a34a; font-weight: bold;">Thành công</span>
                            </div>
                        </div>

                        <div class="amount-row">
                            <span class="amount-label">SỐ TIỀN GIAO DỊCH:</span>
                            <span class="amount-value">${tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}${formattedAmount} đ</span>
                        </div>

                        <div class="signatures">
                            <div class="signature-box">
                                <div class="signature-title">Khách hàng</div>
                                <div class="signature-name">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-title">Đại diện PhongTro123</div>
                                <div class="stamp">ĐÃ XÁC NHẬN</div>
                                <div class="signature-name">Ban quản trị hệ thống</div>
                            </div>
                        </div>

                        <div class="footer">
                            Cảm ơn quý khách đã đồng hành cùng PhongTro123.com!<br/>
                            Mọi thắc mắc về biên lai xin vui lòng gửi phản hồi hỗ trợ qua website hoặc gọi hotline 1900 1234.
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="px-6 py-4 bg-white border-b border-gray-200">
                <h1 className="text-3xl font-semibold py-4 flex items-center gap-2">
                    <MdHistory className="text-blue-600" /> Lịch sử giao dịch
                </h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">Bạn chưa có giao dịch nào.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase">
                                    <th className="p-4 font-medium">Mã giao dịch</th>
                                    <th className="p-4 font-medium">Thời gian</th>
                                    <th className="p-4 font-medium">Loại</th>
                                    <th className="p-4 font-medium">Nội dung</th>
                                    <th className="p-4 font-medium text-right">Số tiền</th>
                                    <th className="p-4 font-medium text-center">Trạng thái</th>
                                    <th className="p-4 font-medium text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-gray-700">{tx.id}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {moment(tx.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                        </td>
                                        <td className="p-4 text-sm">
                                            {tx.type === 'deposit' ? (
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Nạp tiền</span>
                                            ) : tx.type === 'refund' ? (
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Hoàn tiền</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Thanh toán</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{tx.content}</td>
                                        <td className={`p-4 text-sm font-semibold text-right whitespace-nowrap ${(tx.type === 'deposit' || tx.type === 'refund') ? 'text-green-600' : 'text-red-600'}`}>
                                            {(tx.type === 'deposit' || tx.type === 'refund') ? '+' : '-'}{tx.amount?.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="p-4 text-sm text-center">
                                            {tx.status === 'success' ? (
                                                <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Thành công</span>
                                            ) : tx.status === 'pending' ? (
                                                <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Đang chờ</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md text-[11px] font-bold whitespace-nowrap inline-block text-center shadow-sm">Thất bại</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-center">
                                            {tx.status === 'success' && (
                                                <button
                                                    onClick={() => handlePrintInvoice(tx)}
                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded border border-blue-200 text-xs font-semibold shadow-sm transition-all"
                                                >
                                                    🖨️ In biên lai
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
