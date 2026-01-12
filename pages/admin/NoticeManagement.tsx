import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NoticeData {
  _id: string;
  type: string;
  title: string;
  author: string;
  views: number;
  createdAt: string;
}

const NoticeManagement: React.FC = () => {
  const { token } = useAuth();
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: '일반',
    title: '',
    content: ''
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notices?limit=100'); // Get more for management
      const data = await res.json();
      if (Array.isArray(data.notices)) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({ type: '일반', title: '', content: '' });
    setShowModal(true);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`);
      const data = await res.json();
      setEditingNotice(data);
      setFormData({ type: data.type, title: data.title, content: data.content });
      setShowModal(true);
    } catch (err) {
      alert('데이터를 불러오지 못했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingNotice ? `/api/admin/notices/${editingNotice._id}` : '/api/admin/notices';
    const method = editingNotice ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchNotices();
      } else {
        const errData = await res.json();
        alert(errData.message || '저장에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotices();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-500 mt-1">입주민들에게 전달할 공지사항을 작성하고 관리합니다.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          새 공지 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center w-24 tracking-widest">분류</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">제목</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">작성일</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">조회수</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">Loading notices...</td></tr>
               ) : notices.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">등록된 공지사항이 없습니다.</td></tr>
               ) : (
                 notices.map((notice) => (
                   <tr key={notice._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap inline-block min-w-[50px] ${
                          notice.type === '점검' ? 'bg-orange-100 text-orange-600' :
                          notice.type === '안전' ? 'bg-red-100 text-red-600' :
                          notice.type === '행사' ? 'bg-purple-100 text-purple-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notice.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {notice.title}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500 font-medium">
                        {notice.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(notice._id)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="수정"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(notice._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

      {/* Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <h2 className="text-xl font-bold text-gray-900">{editingNotice ? '공지사항 수정' : '새 공지사항 등록'}</h2>
               <button onClick={() => setShowModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </header>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">분류</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-medium"
                  >
                    <option>일반</option>
                    <option>점검</option>
                    <option>안전</option>
                    <option>행사</option>
                  </select>
                </div>
                <div className="col-span-3 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">제목</label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="공지사항 제목을 입력하세요"
                    className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-bold placeholder:font-normal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">내용</label>
                <textarea 
                  required
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="공지 내용을 입력하세요 (HTML 태그 지원)"
                  className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
                />
              </div>
              <footer className="pt-4 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setShowModal(false)}
                   className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                 >
                   취소
                 </button>
                 <button 
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
                 >
                    {editingNotice ? '수정 완료' : '등록하기'}
                 </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;
