import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Notice {
  _id: string;
  type: string;
  title: string;
  views: number;
  createdAt: string;
}

const NoticeList: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('전체');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchNotices = (pageNum: number, category: string) => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: pageNum.toString(),
      limit: '10', // Show 10 items per page
      category: category
    });

    fetch(`/api/notices?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        setNotices(data.notices);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notices:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotices(page, filter);
  }, [page, filter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '점검': return 'orange';
      case '안전': return 'red';
      case '행사': return 'green';
      case '일반': return 'blue';
      default: return 'gray';
    }
  };

  if (loading && page === 1 && notices.length === 0) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#111318] text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">공지사항</h1>
          <p className="text-gray-500 text-sm sm:text-base font-normal">26센터의 최신 소식과 안내 사항을 확인하세요.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dbdfe6] p-3 sm:p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="w-full lg:flex-1">
            <label className="relative flex items-center w-full">
              <div className="absolute left-4 text-gray-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="w-full h-12 bg-gray-50 border-none rounded-lg pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
                placeholder="검색어를 입력하세요" 
              />
            </label>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-1 no-scrollbar">
            {['전체', '점검', '행사', '일반', '안전'].map((category) => (
              <button 
                key={category}
                onClick={() => {
                  setFilter(category);
                  setPage(1);
                }}
                className={`flex h-9 shrink-0 items-center justify-center rounded-lg px-4 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap
                  ${filter === category 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-[#dbdfe6]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-20">번호</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-40">구분</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">제목</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-40">작성일</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-32">조회수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdfe6]">
              {notices.map((item, idx) => {
                const color = getTypeColor(item.type);
                // Calculate global index: totalCount - ((page-1) * limit + idx)
                const displayIndex = totalCount - ((page - 1) * 10 + idx);
                
                return (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5 text-sm text-gray-400 font-medium">{displayIndex}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Link to={`/notices/${item._id}`} className="text-gray-900 font-semibold hover:text-primary transition-colors block decoration-primary/30 hover:underline truncate max-w-md">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-5 text-sm text-gray-600 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      {item.views.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {notices.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-6 py-10 text-center text-gray-500">해당 데이터가 없습니다.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-[#dbdfe6]">
          {notices.map((item, idx) => {
             const color = getTypeColor(item.type);
             return (
               <Link 
                key={item._id} 
                to={`/notices/${item._id}`}
                className="p-5 flex flex-col gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
               >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-${color}-100 text-${color}-700`}>
                        {item.type}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="text-[#111318] font-bold text-lg leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      {item.views.toLocaleString()}
                    </span>
                    <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                      자세히 보기 
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
               </Link>
             );
          })}
          {notices.length === 0 && (
            <div className="p-10 text-center text-gray-500">
               해당 데이터가 없습니다.
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#dbdfe6] bg-gray-50/30">
          <p className="text-sm text-gray-500">
            총 <span className="font-semibold text-gray-900">{totalCount}</span>개
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center justify-center size-9 rounded-lg border border-[#dbdfe6] text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`flex items-center justify-center size-9 rounded-lg text-sm font-bold transition-all
                    ${page === p 
                      ? 'bg-primary text-white' 
                      : 'border border-transparent text-gray-600 hover:border-[#dbdfe6] hover:bg-white'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center justify-center size-9 rounded-lg border border-[#dbdfe6] text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeList;