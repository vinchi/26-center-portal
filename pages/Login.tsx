import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
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
        login(data.token, data.user);
        navigate('/dashboard');
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat" 
            style={{
                backgroundImage: 'linear-gradient(rgba(16, 22, 34, 0.7) 0%, rgba(16, 22, 34, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxs4yOqabOXw-Yjrqacl28Zp96RVbEEiGlFqasvQfAPuI3LYJUUcoWFrPunbLYLUEQa7LV4KZag1CyzothnHLCciBZm1gI81kLrUvrShj3fata3SzyEEzMpHH2v7jWl1nG9W6Nr3GvGaluxEcquKyguo8NHF3V-gd-N7NubJBVZaMwHr56qijHzjNaUmOl11_0k-FZPisHKZB2v3MeSRiqh9IDL1bB7l6qclw6zvoSyf63qDsFT2BE7CssxnDGYtxQ4FXC1iGNshk")'
            }}
        ></div>
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-white text-5xl">apartment</span>
          </div>
          <h1 className="text-white text-4xl font-black tracking-tight">26 CENTER</h1>
          <p className="text-white/80 text-sm mt-1">입주민 서비스 및 자산 관리 포털</p>
        </div>
        <div className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl p-8 transition-colors duration-200">
          <div className="mb-6">
            <h2 className="text-[#111318] text-2xl font-bold">환영합니다</h2>
            <p className="text-[#616f89] text-sm">서비스 이용을 위해 로그인해 주세요</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-medium leading-normal">아이디</label>
              <div className="relative">
                <input 
                    className="flex w-full rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] h-12 placeholder:text-[#616f89] px-4 text-sm font-normal" 
                    placeholder="아이디를 입력하세요" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-medium leading-normal">비밀번호</label>
              <div className="flex w-full items-stretch rounded-lg group relative">
                <input 
                    className="flex w-full min-w-0 flex-1 rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] h-12 placeholder:text-[#616f89] px-4 pr-12 text-sm font-normal" 
                    placeholder="비밀번호를 입력하세요" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="absolute right-0 top-0 h-full flex items-center px-3 cursor-pointer text-[#616f89] hover:text-primary">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-x-2 cursor-pointer select-none">
                <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-[#dbdfe6] text-primary focus:ring-primary"
                />
                <span className="text-[#111318] text-sm font-normal">로그인 상태 유지</span>
              </label>
              <Link to="/find-account" className="text-primary text-sm font-semibold hover:underline">계정 찾기</Link>
            </div>
            <button 
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50" 
                type="submit"
                disabled={loading}
            >
              <span className="truncate">{loading ? '로그인 중...' : '로그인'}</span>
            </button>
          </form>
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#dbdfe6] pt-6">
            <p className="text-[#616f89] text-sm">
                계정이 없으신가요?
                <Link to="/signup" className="text-primary font-bold hover:underline ml-1">회원가입</Link>
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-[#616f89] text-xs hover:text-primary">이용약관</Link>
              <span className="text-[#dbdfe6]">|</span>
              <Link to="/privacy" className="text-[#616f89] text-xs hover:text-primary">개인정보처리방침</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-white/40 text-xs">
            © 2024 26 센터 관리 그룹. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;