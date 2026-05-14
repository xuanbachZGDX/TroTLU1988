import nodemailer from 'nodemailer';
require('dotenv').config();

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: '"PhongTro123" <no-reply@phongtro123.com>',
            to: email,
            subject: subject,
            html: html,
        });

        return true;
    } catch (error) {
        console.log('Lỗi gửi email:', error);
        return false;
    }
};

export default sendEmail;
