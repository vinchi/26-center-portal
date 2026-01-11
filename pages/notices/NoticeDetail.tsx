import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Notice {
  _id: string;
  type: string;
  title: string;
  content: string;
  author: string;
  views: number;
  createdAt: string;
}

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/notices/${id}`)
      .then(res => res.json())
      .then(data => {
        setNotice(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notice:', err);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (!notice) return <div className="p-10 text-center">공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[960px] mx-auto py-8 px-4 sm:px-10">
      <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
        <Link to="/dashboard" className="text-[#616f89] text-sm font-medium hover:text-primary transition-colors">홈</Link>
        <span className="text-[#616f89]">/</span>
        <Link to="/notices" className="text-[#616f89] text-sm font-medium hover:text-primary transition-colors">빌딩 공지사항</Link>
        <span className="text-[#616f89]">/</span>
        <span className="text-[#111318] text-sm font-semibold">공지사항 상세</span>
      </div>

      <article className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm overflow-hidden print:shadow-none print:border-none">
        <div className="p-6 sm:p-10 border-b border-[#f0f2f4]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                {/* Dynamic labels based on type is optional/can be refined */}
                {notice.type === '점검' && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded tracking-wider">긴급</span>}
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded tracking-wider">{notice.type}</span>
              </div>
              <h1 className="text-[#111318] text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em]">{notice.title}</h1>
              {/* <p className="text-[#616f89] text-lg">Subtitle if available</p> */}
            </div>
            <div className="flex gap-2 shrink-0 print:hidden">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-[#dbdfe6] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-base">print</span>
                인쇄하기
              </button>
              <Link to="/notices" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-base">list</span>
                목록으로
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 sm:px-10 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 print:bg-white print:px-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#dbdfe6] print:border-none print:p-0">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <p className="text-[#616f89] text-xs font-medium uppercase tracking-wider">작성자</p>
              <p className="text-[#111318] text-sm font-semibold">{notice.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#dbdfe6] print:border-none print:p-0">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div>
              <p className="text-[#616f89] text-xs font-medium uppercase tracking-wider">작성일</p>
              <p className="text-[#111318] text-sm font-semibold">{formatDate(notice.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#dbdfe6] print:border-none print:p-0">
              <span className="material-symbols-outlined text-primary">visibility</span>
            </div>
            <div>
              <p className="text-[#616f89] text-xs font-medium uppercase tracking-wider">조회수</p>
              <p className="text-[#111318] text-sm font-semibold">{notice.views.toLocaleString()} 회</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 print:px-0">
          <div className="prose max-w-none text-[#111318] text-base leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: notice.content }}>
            {/* Content rendered dynamically */}
          </div>

          <div className="mt-12 print:hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">attachment</span>
              첨부파일
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-[#dbdfe6] rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                   {/* Mock attachment UI */}
                  <div className="size-10 bg-red-100 flex items-center justify-center rounded-lg text-red-600">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">첨부파일_예시.pdf</p>
                    <p className="text-xs text-[#616f89]">2.4 MB</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#616f89] group-hover:text-primary transition-colors">download</span>
              </div>
            </div>
          </div>
        </div>
      </article>

       {/* Next/Prev Navigation Mockup */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
        <Link to="/notices" className="flex-1 flex items-center gap-4 p-4 rounded-xl border border-[#dbdfe6] bg-white hover:border-primary transition-all group">
          <div className="size-10 flex items-center justify-center rounded-full bg-[#f0f2f4] group-hover:bg-primary/10 group-hover:text-primary">
            <span className="material-symbols-outlined">chevron_left</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-[#616f89] uppercase tracking-wider">이전글</p>
            <p className="text-sm font-bold truncate">목록으로 돌아가기</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NoticeDetail;