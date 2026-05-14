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
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">Nạp tiền</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs font-medium">Thanh toán</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{tx.content}</td>
                                        <td className={`p-4 text-sm font-semibold text-right ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'deposit' ? '+' : '-'}{tx.amount?.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="p-4 text-sm text-center">
                                            {tx.status === 'success' ? (
                                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs border border-green-200">Thành công</span>
                                            ) : tx.status === 'pending' ? (
                                                <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs border border-yellow-200">Đang chờ</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs border border-red-200">Thất bại</span>
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
