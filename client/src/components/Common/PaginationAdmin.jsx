import React, { memo, useEffect, useState } from "react";

const PaginationAdmin = ({ page, setPage, totalPages }) => {
    const [arrPage, setArrPage] = useState([]);
    const [isHideEnd, setIsHideEnd] = useState(false);
    const [isHideStart, setIsHideStart] = useState(false);

    useEffect(() => {
        let start = page - 2 <= 0 ? 1 : page - 2;
        let end = start + 4 > totalPages ? totalPages : start + 4;
        if (end === totalPages && totalPages > 5) {
            start = totalPages - 4;
        }

        let temp = [];
        for (let i = start; i <= end; i++) {
            temp.push(i);
        }
        setArrPage(temp);
        page >= totalPages - 2 ? setIsHideEnd(true) : setIsHideEnd(false);
        page <= 3 ? setIsHideStart(true) : setIsHideStart(false);
    }, [page, totalPages]);

    return (
        <div className="flex items-center justify-center gap-2 py-4 select-none">
            <button
                type="button"
                disabled={+page <= 1}
                onClick={() => {
                    setPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-sm font-semibold transition-all shadow-sm ${+page <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 active:scale-95'}`}
            >
                « Trang trước
            </button>

            {/* Hiển thị Trang 1 nếu đang ở xa đầu danh sách */}
            {arrPage[0] > 1 && (
                <>
                    <button
                        onClick={() => {
                            setPage(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all shadow-sm active:scale-95 ${+page === 1 ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        1
                    </button>
                    {arrPage[0] > 2 && <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>}
                </>
            )}

            {/* Hiển thị dãy trang xung quanh trang hiện tại */}
            {arrPage.map(item => (
                <button
                    key={item}
                    onClick={() => {
                        setPage(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all shadow-sm active:scale-95 ${+page === +item ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                    {item}
                </button>
            ))}

            {/* Hiển thị Trang cuối nếu đang ở xa cuối danh sách */}
            {arrPage[arrPage.length - 1] < totalPages && (
                <>
                    {arrPage[arrPage.length - 1] < totalPages - 1 && <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>}
                    <button
                        onClick={() => {
                            setPage(totalPages);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all shadow-sm active:scale-95 ${+page === +totalPages ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                type="button"
                disabled={+page >= totalPages}
                onClick={() => {
                    setPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-sm font-semibold transition-all shadow-sm ${+page >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 active:scale-95'}`}
            >
                Trang sau »
            </button>
        </div>
    );
};

export default memo(PaginationAdmin);
