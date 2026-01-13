import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role !== 'admin') {
          setError('관리자 권한이 없는 계정입니다.');
          return;
        }
        login(data.token, data.user);
        navigate('/admin');
      } else {
        setError(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error(err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">관리자 포털</h1>
          <p className="text-slate-400 text-sm">26센터 통합 관리 시스템 로그인</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">관리자 아이디</label>
              <input 
                type="text"
                className="w-full bg-[#334155] border border-slate-600 rounded-lg h-12 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-500"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">비밀번호</label>
              <input 
                type="password"
                className="w-full bg-[#334155] border border-slate-600 rounded-lg h-12 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-500"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
                  <span>처리중...</span>
                </>
              ) : (
                '관리자 로그인'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              일반 사용자 로그인으로 돌아가기
            </button>
          </div>
        </div>
        
        <div className="bg-[#0f172a]/50 p-4 text-center">
          <p className="text-slate-500 text-xs">© 2024 26 CENTER ADMIN SYSTEM</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
