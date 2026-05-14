import axiosConfig from '../axiosConfig';

export const apiCreatePaymentUrl = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/payment/create_payment_url',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiVnpayReturn = (query) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/payment/vnpay_return${query}`
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetTransactionHistory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/payment/history'
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
