import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { apiCreatePaymentUrl } from '../../../services';
import Swal from 'sweetalert2';
import icons from '../../../utils/icons';

const { BsWallet2 } = icons;

const Deposit = () => {
    const { currentData } = useSelector(state => state.user);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000];

    const handleDeposit = async () => {
        if (!amount || amount < 10000) {
            Swal.fire('Lỗi', 'Số tiền nạp tối thiểu là 10.000đ', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCreatePaymentUrl({ amount: Number(amount) });
            if (response.data?.code === '00') {
                window.location.href = response.data.data;
            } else {
                Swal.fire('Lỗi', 'Không thể tạo giao dịch thanh toán', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', 'Đã xảy ra lỗi hệ thống', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="px-6 py-4 bg-white border-b border-gray-200">
                <h1 className="text-3xl font-semibold py-4">Nạp tiền vào tài khoản</h1>
            </div>

            <div className="p-6 flex gap-6">
                <div className="w-2/3 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                        <h2 className="text-xl font-medium mb-4">Phương thức thanh toán</h2>
                        <div className="border border-blue-500 rounded-md p-4 bg-blue-50 flex items-center gap-4 cursor-pointer">
                            <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" className="h-8" />
                            <div>
                                <p className="font-medium text-blue-800">Thanh toán qua VNPAY</p>
                                <p className="text-sm text-blue-600">Thẻ ATM nội địa, thẻ quốc tế, ví VNPAY</p>
                            </div>
                        </div>

                        <h2 className="text-xl font-medium mt-8 mb-4">Chọn số tiền nạp</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {predefinedAmounts.map(val => (
                                <div 
                                    key={val} 
                                    onClick={() => setAmount(val)}
                                    className={`border rounded-md p-3 text-center cursor-pointer transition-all ${amount === val ? 'border-red-500 bg-red-50 text-red-600 font-medium' : 'border-gray-300 hover:border-red-300 hover:bg-gray-50'}`}
                                >
                                    {val.toLocaleString('vi-VN')} đ
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2 mb-6">
                            <label className="font-medium">Số tiền nạp (VNĐ)</label>
                            <input 
                                type="number" 
                                className="border border-gray-300 p-3 rounded-md outline-none focus:border-red-500" 
                                placeholder="Nhập số tiền cần nạp..." 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>

                        <button 
                            onClick={handleDeposit} 
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-medium py-3 rounded-md hover:bg-red-700 transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                        </button>
                    </div>
                </div>

                <div className="w-1/3">
                    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <img src={currentData?.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <p className="font-medium text-lg">{currentData?.name}</p>
                                <p className="text-gray-500 text-sm">{currentData?.phone}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BsWallet2 size={20} />
                                <span>Số dư hiện tại</span>
                            </div>
                            <span className="text-xl font-bold text-red-600">{(currentData?.balance || 0).toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposit;
