import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Complaint {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Processing' | 'Complete';
  createdAt: string;
  updatedAt: string;
}

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then(res => res.json())
      .then(data => {
        setComplaint(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch complaint:', err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityInfo = (priority?: string) => {
    switch (priority) {
      case 'High': return { label: '매우 높음', color: 'text-red-600 bg-red-50', icon: 'priority_high' };
      case 'Medium': return { label: '보통', color: 'text-orange-600 bg-orange-50', icon: 'remove' };
      case 'Low': return { label: '낮음', color: 'text-blue-600 bg-blue-50', icon: 'keyboard_arrow_down' };
      default: return { label: '', color: '', icon: '' };
    }
  };

  const statusMap = {
    'Pending': { label: '접수대기', color: 'text-gray-500 bg-gray-100' },
    'Processing': { label: '처리중', color: 'text-primary bg-primary/10' },
    'Complete': { label: '완료', color: 'text-green-600 bg-green-50' }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;
  if (!complaint) return <div className="p-10 text-center">민원을 찾을 수 없습니다.</div>;

  const isAuthor = user?.id === complaint.author;
  const pInfo = getPriorityInfo(complaint.priority);
  const sInfo = statusMap[complaint.status];

  return (
    <div className="max-w-[800px] mx-auto w-full px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/complaints" className="hover:text-primary transition-colors">민원 목록</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">상세보기</span>
          </div>
          <h1 className="text-[#111318] text-3xl font-black leading-tight tracking-[-0.033em]">{complaint.title}</h1>
        </div>
        {isAuthor && (
          <Link 
            to={`/complaints/edit/${complaint._id}`}
            className="flex h-12 items-center justify-center rounded-xl bg-white border border-[#dbdfe6] px-6 text-[#111318] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            수정하기
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#dbdfe6] overflow-hidden shadow-sm">
        <div className="bg-gray-50/50 px-6 sm:px-10 py-6 border-b border-[#f0f2f4] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[#616f89] text-xs font-bold uppercase tracking-wider">처리상태</p>
            <div className="flex">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sInfo.color}`}>{sInfo.label}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[#616f89] text-xs font-bold uppercase tracking-wider">우선순위</p>
            <div className="flex items-center gap-1.5">
               <span className={`p-0.5 rounded ${pInfo.color} material-symbols-outlined text-xs`}>{pInfo.icon}</span>
               <span className={`text-sm font-bold ${pInfo.color.split(' ')[0]}`}>{pInfo.label}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[#616f89] text-xs font-bold uppercase tracking-wider">작성자</p>
            <p className="text-[#111318] text-sm font-bold">{complaint.authorName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#616f89] text-xs font-bold uppercase tracking-wider">작성일시</p>
            <p className="text-[#111318] text-sm font-bold">{formatDate(complaint.createdAt)}</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 min-h-[300px]">
          <div 
            className="prose max-w-none text-[#111318] text-base leading-relaxed whitespace-normal quill-content"
            dangerouslySetInnerHTML={{ __html: complaint.content }}
          />
        </div>

        <style>{`
          .quill-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .quill-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .quill-content h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
          .quill-content h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
          .quill-content p { margin-bottom: 0.5rem; }
        `}</style>

        {complaint.status === 'Complete' && (
          <div className="m-6 sm:m-10 p-6 bg-green-50 rounded-2xl border border-green-100 border-l-4 border-l-green-600">
            <h3 className="text-green-800 font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              처리 완료 안내
            </h3>
            <p className="text-sm text-green-700 leading-relaxed">
              본 민원은 정상적으로 처리 완료되었습니다. 추가 문의 사항이나 불편한 점이 있으시면 새로운 민원을 접수해 주시기 바랍니다.
            </p>
          </div>
        )}
      </div>

       <div className="mt-8">
        <button 
          onClick={() => navigate('/complaints')}
          className="w-full h-14 rounded-2xl bg-[#111318] text-white text-base font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ComplaintDetail;