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

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null);
  const [showModal, setShowModal] = useState(false);

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        if (selectedComplaint && selectedComplaint._id === id) {
          setSelectedComplaint({...selectedComplaint, status: newStatus as any});
        }
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
        setShowModal(false);
        fetchComplaints();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const openDetail = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
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
                    <td className="px-6 py-4 cursor-pointer" onClick={() => openDetail(c)}>
                       <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{c.title}</p>
                       <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{stripHtmlTags(c.content)}</p>
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
                            onClick={() => openDetail(c)}
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

      {/* Detail Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div>
                  <h2 className="text-xl font-bold text-gray-900">민원 상세 내용</h2>
                  <p className="text-xs text-gray-500 mt-1">접수번호: {selectedComplaint._id}</p>
               </div>
               <button onClick={() => setShowModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </header>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">작성자</p>
                  <p className="text-base font-bold text-gray-900">{selectedComplaint.authorName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">접수 일시</p>
                  <p className="text-base font-bold text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      selectedComplaint.status === 'Complete' ? 'bg-green-100 text-green-700' :
                      selectedComplaint.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedComplaint.status === 'Complete' ? '처리완료' : 
                       selectedComplaint.status === 'Processing' ? '처리중' : '접수대기'}
                   </div>
                   <h3 className="text-lg font-bold text-gray-900">{selectedComplaint.title}</h3>
                </div>
                
                <div className="min-h-[150px] p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-800 leading-relaxed text-base quill-content">
                  <div dangerouslySetInnerHTML={{ __html: selectedComplaint.content }} />
                </div>

                <style>{`
                  .quill-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                  .quill-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                  .quill-content h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
                  .quill-content h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
                  .quill-content p { margin-bottom: 0.25rem; }
                `}</style>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(selectedComplaint._id, 'Processing')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${selectedComplaint.status === 'Processing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      처리중으로 변경
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedComplaint._id, 'Complete')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${selectedComplaint.status === 'Complete' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      해결 완료
                    </button>
                 </div>
                 <button 
                   onClick={() => deleteComplaint(selectedComplaint._id)}
                   className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                 >
                   삭제하기
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
