import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ComplaintData {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  status: 'Pending' | 'Processing' | 'Complete';
  createdAt: string;
}

const ComplaintManagement: React.FC = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (err) {
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const deleteComplaint = async (id: string) => {
    if (!window.confirm('정말 이 민원을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">민원 관리</h1>
        <p className="text-gray-500 mt-1">입주자가 접수한 민원 사항을 검토하고 처리 상태를 관리합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center w-16">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">민원 내용</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">작성자</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">접수일</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                 <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">Loading complaints...</td></tr>
              ) : complaints.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">접수된 민원이 없습니다.</td></tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-center">
                       <select 
                         value={c.status}
                         onChange={(e) => updateStatus(c._id, e.target.value)}
                         className={`px-3 py-1 rounded-full text-[10px] font-bold border-none outline-none cursor-pointer ${
                           c.status === 'Complete' ? 'bg-green-100 text-green-700' :
                           c.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                           'bg-gray-100 text-gray-600'
                         }`}
                       >
                         <option value="Pending">접수대기</option>
                         <option value="Processing">처리중</option>
                         <option value="Complete">완료</option>
                       </select>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-gray-900">{c.title}</p>
                       <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.content}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                       {c.authorName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                       {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 text-gray-400">
                          <button 
                            className="p-2 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="상세보기"
                          >
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                          <button 
                            onClick={() => deleteComplaint(c._id)}
                            className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="삭제"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
