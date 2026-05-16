import React from "react";
import { Link } from "react-router-dom";
import { path } from "../../utils/constant";
import { FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";


const ABOUT_LINKS = [
  { label: "Giới thiệu",           href: "#" },
  { label: "Quy chế hoạt động",    href: "#" },
  { label: "Quy định sử dụng",     href: "#" },
  { label: "Chính sách bảo mật",   href: "#" },
  { label: "Liên hệ",              to: `/${path.CONTACT}` },
];

const CUSTOMER_LINKS = [
  { label: "Câu hỏi thường gặp",   href: "#" },
  { label: "Hướng dẫn đăng tin",   href: "#" },
  { label: "Bảng giá dịch vụ",     href: "#" },
  { label: "Quy định đăng tin",    href: "#" },
  { label: "Giải quyết khiếu nại", href: "#" },
];

const PAYMENT_METHODS = [
  { label: "VISA",       bg: "#1a1f71", color: "#fff" },
  { label: "MasterCard", bg: "#eb001b", color: "#fff" },
  { label: "JCB",        bg: "#003087", color: "#fff" },
  { label: "MoMo",       bg: "#ae2070", color: "#fff" },
  { label: "ZaloPay",    bg: "#0068ff", color: "#fff" },
  { label: "ShopeePay",  bg: "#f05d25", color: "#fff" },
];

const SOCIAL_LINKS = [
  { icon: <FaFacebook size={20} />, bg: "#1877f2", href: "https://facebook.com",   label: "Facebook" },
  { icon: <FaYoutube  size={20} />, bg: "#ff0000", href: "https://youtube.com",    label: "YouTube"  },
  { icon: <span className="text-xs font-extrabold">Zalo</span>, bg: "#0068ff", href: "https://zalo.me", label: "Zalo" },
  { icon: <FaTwitter  size={20} />, bg: "#1da1f2", href: "https://twitter.com",   label: "Twitter"  },
  { icon: <FaTiktok   size={20} />, bg: "#010101", href: "https://tiktok.com",    label: "TikTok"   },
];


/** Cột chứa danh sách link */
const LinkColumn = ({ title, links }) => (
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
        <a
          key={link.label}
          href={link.href}
          className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200"
        >
          {link.label}
        </a>
      )
    )}
  </div>
);

// Main Footer
const Footer = () => (
  <footer className="w-full bg-gray-50 border-t-4 border-blue-600 mt-12">
    <div className="w-1100 max-w-full mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

      {/* Về Phongtro123.com */}
      <LinkColumn title="Về Phongtro123.com" links={ABOUT_LINKS} />

      {/* Dành cho khách hàng */}
      <LinkColumn title="Dành cho khách hàng" links={CUSTOMER_LINKS} />

      {/* Phương thức thanh toán */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-bold uppercase text-blue-700 mb-2 tracking-wide">
          Thanh toán an toàn
        </h3>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((p) => (
            <span
              key={p.label}
              style={{ backgroundColor: "#fff", border: `1px solid #e2e8f0`, color: '#475569' }}
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
              Kênh thông tin phòng trọ số 1 Việt Nam - Uy tín, Hiệu quả.
           </p>
        </div>
      </div>
    </div>

    {/* Copyright bar */}
    <div className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
      <div className="w-1100 mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} <span className="font-bold text-blue-600">Phongtro123.com</span>. Tất cả quyền được bảo lưu.</p>
        <div className="flex gap-8 font-medium">
            <span className="hover:text-blue-600 cursor-pointer">Chính sách</span>
            <span className="hover:text-blue-600 cursor-pointer">Bảo mật</span>
            <span className="hover:text-blue-600 cursor-pointer">Trợ giúp</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
