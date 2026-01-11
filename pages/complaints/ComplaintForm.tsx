import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ComplaintForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      fetch(`/api/complaints/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.author !== user?.id) {
            alert('본인의 민원만 수정할 수 있습니다.');
            navigate('/complaints');
            return;
          }
          setTitle(data.title);
          setContent(data.content);
          setPriority(data.priority);
          setFetching(false);
        })
        .catch(err => {
          console.error('Failed to fetch complaint:', err);
          setFetching(false);
        });
    }
  }, [id, isEdit, user?.id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    setLoading(true);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/complaints/${id}` : '/api/complaints';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, priority })
      });

      if (res.ok) {
        alert(isEdit ? '민원이 수정되었습니다.' : '민원이 접수되었습니다.');
        navigate('/complaints');
      } else {
        const data = await res.json();
        alert(data.message || '처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="max-w-[800px] mx-auto w-full px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/complaints" className="hover:text-primary transition-colors">민원 목록</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{isEdit ? '민원 수정' : '민원 신청'}</span>
        </div>
        <h1 className="text-[#111318] text-3xl font-black leading-tight tracking-[-0.033em]">
          {isEdit ? '민원 내용 수정' : '새로운 민원 접수'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#dbdfe6] p-6 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111318]">우선순위</label>
            <div className="flex gap-3">
              {(['Low', 'Medium', 'High'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                    priority === p 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {p === 'High' ? '매우 높음' : p === 'Medium' ? '보통' : '낮음'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-[#111318]">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 bg-gray-50 border-none rounded-xl px-4 text-[#111318] placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="불편 사항의 제목을 입력해 주세요"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-bold text-[#111318]">문의 내용</label>
            <textarea
              id="content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-[#111318] placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="자세한 내용을 입력해 주세요. (위치, 증상 등)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-14 rounded-xl bg-gray-100 text-[#111318] text-base font-bold hover:bg-gray-200 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-14 rounded-xl bg-primary text-white text-base font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? '처리 중...' : isEdit ? '수정 완료' : '민원 접수하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
