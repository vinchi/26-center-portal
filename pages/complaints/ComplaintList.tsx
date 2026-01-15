import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Complaint {
  _id: string;
  title: string;
  authorName: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Processing' | 'Complete';
  createdAt: string;
}

const ComplaintList: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch complaints:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase">매우 높음</span>;
      case 'Medium': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 uppercase">보통</span>;
      case 'Low': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">낮음</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase">접수대기</span>;
      case 'Processing': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary uppercase">처리중</span>;
      case 'Complete': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 uppercase">완료</span>;
      default: return null;
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#111318] text-4xl font-black leading-tight tracking-[-0.033em]">민원/수리 신청</h1>
          <p className="text-gray-500 text-base font-normal">건물 이용 중 불편한 점이나 수리가 필요한 사항을 접수해 주세요.</p>
        </div>
        <Link 
          to="/complaints/new" 
          className="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-white text-base font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          민원 신청하기
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm overflow-hidden">

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-[#dbdfe6]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-20">No</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-32">우선순위</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">제목</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-28">작성자</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-36 whitespace-nowrap">작성일</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-32 text-center">처리상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdfe6]">
              {complaints.map((item, idx) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5 text-sm text-gray-400 font-medium">{complaints.length - idx}</td>
                  <td className="px-6 py-5">{getPriorityBadge(item.priority)}</td>
                  <td className="px-6 py-5">
                    <Link to={`/complaints/${item._id}`} className="text-gray-900 font-semibold hover:text-primary transition-colors block underline-offset-4 hover:underline truncate max-w-md">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">{item.authorName}</td>
                  <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-5 text-center">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">등록된 민원이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-[#dbdfe6]">
           {complaints.map((item) => (
             <Link 
              key={item._id} 
              to={`/complaints/${item._id}`}
              className="p-5 flex flex-col gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status)}
                 </div>
                 <span className="text-xs text-gray-400 font-medium">{formatDate(item.createdAt)}</span>
               </div>
               
               <h3 className="text-[#111318] font-bold text-lg leading-snug line-clamp-2">
                 {item.title}
               </h3>

               <div className="flex items-center justify-between pt-1">
                 <div className="flex items-center gap-1.5">
                   <div className="size-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold">
                      {item.authorName.charAt(0)}
                   </div>
                   <span className="text-xs text-gray-500">{item.authorName}</span>
                 </div>
                  <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                    상세보기 
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
               </div>
             </Link>
           ))}
           {complaints.length === 0 && (
              <div className="p-10 text-center text-gray-500">등록된 민원이 없습니다.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintList;