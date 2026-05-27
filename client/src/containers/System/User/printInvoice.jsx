import moment from 'moment';

export const handlePrintInvoice = (tx, userName) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    const formattedAmount = tx.amount?.toLocaleString('vi-VN');
    const formattedDate = moment(tx.createdAt).format('DD/MM/YYYY HH:mm:ss');
    const typeLabel = tx.type === 'deposit' ? 'Nạp tiền vào ví' : tx.type === 'refund' ? 'Hoàn tiền vào ví' : 'Thanh toán phí dịch vụ';
    const typeColor = tx.type === 'deposit' || tx.type === 'refund' ? '#059669' : '#dc2626';
    const customerName = userName || 'Khách hàng hệ thống';

    printWindow.document.write(`
        <html>
            <head>
                <title>Biên lai giao dịch TLU.com - #${tx.id.slice(0, 8).toUpperCase()}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body { 
                        font-family: 'Inter', sans-serif; 
                        color: #1f2937; 
                        margin: 0; 
                        padding: 50px; 
                        background-color: #f9fafb;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice-container { 
                        max-width: 680px; 
                        margin: 0 auto; 
                        background: #ffffff;
                        border: 1px solid #e5e7eb; 
                        padding: 40px; 
                        border-radius: 16px; 
                        position: relative; 
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); 
                    }
                    .header { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center; 
                        border-bottom: 2px solid #3b82f6; 
                        padding-bottom: 25px; 
                        margin-bottom: 30px; 
                    }
                    .logo-section {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .logo { 
                        font-size: 28px; 
                        font-weight: 800; 
                        color: #1d4ed8; 
                        letter-spacing: -0.5px; 
                    }
                    .logo span {
                        color: #3b82f6;
                    }
                    .title { 
                        font-size: 20px; 
                        font-weight: 700; 
                        text-align: center; 
                        color: #111827; 
                        margin-bottom: 35px; 
                        text-transform: uppercase; 
                        letter-spacing: 0.5px; 
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 35px;
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid #f1f5f9;
                    }
                    .info-item {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    .info-label {
                        font-size: 11px;
                        font-weight: 600;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .info-value {
                        font-size: 14px;
                        font-weight: 500;
                        color: #0f172a;
                    }
                    .info-value-mono {
                        font-family: monospace;
                        font-weight: 700;
                        color: #1e3a8a;
                        font-size: 15px;
                    }
                    .receipt-details {
                        border-top: 1px dashed #cbd5e1;
                        border-bottom: 1px dashed #cbd5e1;
                        padding: 20px 0;
                        margin-bottom: 35px;
                    }
                    .row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin-bottom: 14px; 
                        font-size: 14px; 
                    }
                    .row:last-child {
                        margin-bottom: 0;
                    }
                    .row-label { 
                        color: #475569; 
                        font-weight: 500;
                    }
                    .row-value { 
                        text-align: right; 
                        color: #0f172a; 
                        font-weight: 600; 
                    }
                    .amount-card { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center;
                        background-color: #f0fdf4; 
                        border: 1px solid #bbf7d0; 
                        padding: 20px; 
                        border-radius: 12px; 
                        margin: 30px 0; 
                    }
                    .amount-label { 
                        font-size: 14px; 
                        font-weight: 700; 
                        color: #166534; 
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .amount-value { 
                        font-size: 24px; 
                        font-weight: 800; 
                        color: ${typeColor}; 
                    }
                    .signatures { 
                        display: flex; 
                        justify-content: space-between; 
                        margin-top: 50px; 
                        padding: 0 10px; 
                    }
                    .signature-box { 
                        text-align: center; 
                        width: 220px; 
                        position: relative; 
                    }
                    .signature-title { 
                        font-weight: 600; 
                        font-size: 13px; 
                        margin-bottom: 70px; 
                        color: #334155; 
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .signature-name { 
                        font-weight: 500;
                        color: #475569; 
                        font-size: 13px; 
                    }
                    .stamp { 
                        position: absolute; 
                        top: 25px; 
                        left: 50%;
                        transform: translateX(-50%) rotate(-8deg); 
                        font-weight: 800; 
                        color: #ef4444; 
                        border: 3px double #ef4444; 
                        padding: 6px 16px; 
                        border-radius: 8px; 
                        font-size: 13px; 
                        letter-spacing: 2px; 
                        text-transform: uppercase; 
                        background-color: rgba(255, 255, 255, 0.95); 
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }
                    .footer { 
                        margin-top: 60px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #64748b; 
                        border-top: 1px solid #e2e8f0; 
                        padding-top: 25px; 
                        line-height: 1.6; 
                    }
                    @media print {
                        body { 
                            padding: 0; 
                            background: none; 
                        }
                        .invoice-container { 
                            border: none; 
                            padding: 20px; 
                            box-shadow: none; 
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="logo-section">
                            <div class="logo">TLU<span>.com</span></div>
                        </div>
                        <div style="text-align: right; font-size: 11px; color: #64748b; line-height: 1.6;">
                            <strong>KÊNH THÔNG TIN PHÒNG TRỌ SỐ 1 VIỆT NAM</strong><br/>
                            Website: www.tlu.com<br/>
                            Hotline: 1900 1234 - Support: support@tlu.com
                        </div>
                    </div>
                    
                    <div class="title">Biên Lai Xác Nhận Giao Dịch</div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Mã giao dịch</span>
                            <span class="info-value-mono">${tx.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Thời gian</span>
                            <span class="info-value">${formattedDate}</span>
                        </div>
                        <div class="info-item" style="grid-column: span 2;">
                            <span class="info-label">Khách hàng thực hiện</span>
                            <span class="info-value" style="font-weight: 700; color: #1d4ed8;">${customerName}</span>
                        </div>
                    </div>
                    
                    <div class="receipt-details">
                        <div class="row">
                            <span class="row-label">Loại giao dịch:</span>
                            <span class="row-value">${typeLabel}</span>
                        </div>
                        <div class="row">
                            <span class="row-label">Nội dung thanh toán:</span>
                            <span class="row-value" style="max-width: 400px; display: inline-block;">${tx.content}</span>
                        </div>
                        <div class="row">
                            <span class="row-label">Trạng thái hệ thống:</span>
                            <span class="row-value" style="color: #059669; font-weight: bold;">Thành công</span>
                        </div>
                    </div>

                    <div class="amount-card">
                        <span class="amount-label">Số tiền giao dịch:</span>
                        <span class="amount-value">${tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}${formattedAmount} đ</span>
                    </div>

                    <div class="signatures">
                        <div class="signature-box">
                            <div class="signature-title">Khách hàng</div>
                            <div class="signature-name" style="margin-top: 40px; font-weight: bold;">${customerName}</div>
                            <div class="signature-name">(Ký và ghi rõ họ tên)</div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-title">Đại diện TLU.com</div>
                            <div class="stamp">ĐÃ THANH TOÁN</div>
                            <div class="signature-name" style="margin-top: 40px; font-weight: bold;">Ban Quản Trị TLU</div>
                            <div class="signature-name">Hệ thống hóa đơn điện tử</div>
                        </div>
                    </div>

                    <div class="footer">
                        Cảm ơn quý khách đã tin dùng và sử dụng dịch vụ của TLU.com!<br/>
                        Biên lai này được ký điện tử tự động và có giá trị xác nhận giao dịch chính thức.
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
