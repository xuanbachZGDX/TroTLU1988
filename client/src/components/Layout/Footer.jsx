import React, { useState } from "react";
import { Link } from "react-router-dom";
import { path } from "../../utils/constant";
import {
  ABOUT_LINKS,
  CUSTOMER_LINKS,
  PAYMENT_METHODS,
  SOCIAL_LINKS,
  DOCS_CONTENT,
} from "./footerData";

/** Cột chứa danh sách link */
const LinkColumn = ({ title, links, onLinkClick }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-[14px] font-bold uppercase text-blue-700 mb-2 tracking-wide">
      {title}
    </h3>
    {links.map((link) =>
      link.to ? (
        <Link
          key={link.label}
          to={link.to}
          className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200"
        >
          {link.label}
        </Link>
      ) : (
        <button
          key={link.label}
          type="button"
          onClick={() => onLinkClick(link.id)}
          className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 text-left cursor-pointer focus:outline-none"
        >
          {link.label}
        </button>
      ),
    )}
  </div>
);

// Main Footer
const Footer = () => {
  const [activeDoc, setActiveDoc] = useState(null);

  const handleOpenDoc = (id) => {
    if (DOCS_CONTENT[id]) {
      setActiveDoc(DOCS_CONTENT[id]);
    }
  };

  return (
    <footer className="w-full bg-gray-50 border-t-4 border-blue-600 mt-12">
      <div className="w-1100 max-w-full mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Về TroTLU1988.com */}
        <LinkColumn
          title="Về TroTLU1988.com"
          links={ABOUT_LINKS}
          onLinkClick={handleOpenDoc}
        />

        {/* Dành cho khách hàng */}
        <LinkColumn
          title="Dành cho khách hàng"
          links={CUSTOMER_LINKS}
          onLinkClick={handleOpenDoc}
        />

        {/* Phương thức thanh toán */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold uppercase text-blue-700 mb-2 tracking-wide">
            Thanh toán an toàn
          </h3>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((p) => (
              <span
                key={p.label}
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid #e2e8f0`,
                  color: "#475569",
                }}
                className="text-[10px] font-bold px-3 py-1.5 rounded shadow-sm uppercase"
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Mạng xã hội */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-bold uppercase text-blue-700 mb-2 tracking-wide">
            Theo dõi chúng tôi
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                style={{ backgroundColor: s.bg }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white
                           hover:opacity-80 hover:scale-110 shadow-sm transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Kênh thông tin phòng trọ uy tín Việt Nam - Uy tín, Hiệu quả.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="w-1100 mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-blue-600">TroTLU1988.com</span>. Tất
            cả quyền được bảo lưu.
          </p>
          <div className="flex gap-8 font-medium">
            <span
              onClick={() => handleOpenDoc("quy-dinh-su-dung")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Chính sách
            </span>
            <span
              onClick={() => handleOpenDoc("bao-mat")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Bảo mật
            </span>
            <span
              onClick={() => handleOpenDoc("faq")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Trợ giúp
            </span>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {activeDoc && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveDoc(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-xl font-bold focus:outline-none"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-blue-700 border-b pb-3 mb-4 pr-6">
              {activeDoc.title}
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {activeDoc.content}
            </div>
            <button
              type="button"
              onClick={() => setActiveDoc(null)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
