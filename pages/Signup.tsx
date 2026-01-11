import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    company: '',
    room: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log('Response Status:', response.status);
      console.log('Response Body:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        throw new Error('Server returned invalid JSON: ' + text.substring(0, 100));
      }

      if (response.ok) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <header className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-4 md:px-40 py-3">
        <div className="flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-4 group">
             <div className="size-6 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">apartment</span>
             </div>
             <h2 className="text-[#111318] text-lg font-bold leading-tight group-hover:text-primary transition-colors">26센터</h2>
          </Link>
        </div>
        <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-9">
                <Link to="/login" className="text-[#111318] text-sm font-medium hover:text-primary transition-colors">홈</Link>
                <a href="#" className="text-[#111318] text-sm font-medium hover:text-primary transition-colors">건물 정보</a>
                <Link to="/support" className="text-[#111318] text-sm font-medium hover:text-primary transition-colors">문의하기</Link>
            </nav>
            <Link to="/login" className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111318] text-sm font-bold hover:bg-gray-200 transition-colors">
                로그인
            </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 px-4">
        <div className="max-w-[560px] w-full flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-[#111318] text-[32px] font-bold leading-tight pb-3">26센터 회원가입</h1>
            <p className="text-[#616f89] text-sm font-normal leading-normal">건물 서비스, 유지 보수 및 공지 사항을 확인하기 위해 입주사 또는 관리자 계정을 생성하세요.</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex gap-6 justify-between items-center mb-1">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">2단계: 정보 입력</span>
                <p className="text-[#111318] text-sm font-medium">66% 완료</p>
              </div>
              <div className="rounded-full bg-[#dbdfe6] h-2 w-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: '66%' }}></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#616f89] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> 약관 동의
                </span>
                <span className="text-xs text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">radio_button_checked</span> 정보 입력
                </span>
                <span className="text-xs text-[#616f89] font-medium flex items-center gap-1 opacity-50">
                  <span className="material-symbols-outlined text-[14px]">pending</span> 가입 완료
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full bg-white rounded-xl shadow-md border border-[#e5e7eb] overflow-hidden">
            <div className="p-8">
              <form className="space-y-5" onSubmit={handleSignup}>
                {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</div>}
                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] text-sm font-semibold">아이디</label>
                  <div className="relative">
                    <input 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="user123" 
                        type="text" 
                        required 
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[#616f89] text-[20px]">badge</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] text-sm font-semibold">이름</label>
                  <div className="relative">
                    <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="홍길동" 
                        type="text" 
                        required 
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[#616f89] text-[20px]">person</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] text-sm font-semibold">업체명/부서</label>
                    <input 
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="마케팅팀" 
                        type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] text-sm font-semibold">호실</label>
                    <input 
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="405호" 
                        type="text" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] text-sm font-semibold">이메일</label>
                  <div className="relative">
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="name@company.com" 
                        type="email" 
                        required 
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-green-500 text-[20px]">check_circle</span>
                  </div>
                  <p className="text-[12px] text-green-600 font-medium">사용 가능한 이메일입니다.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] text-sm font-semibold">연락처</label>
                  <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                      placeholder="010-0000-0000" 
                      type="tel" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#111318] text-sm font-semibold">비밀번호</label>
                  <div className="relative">
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                        placeholder="••••••••" 
                        type="password" 
                        required 
                    />
                    <button className="absolute right-3 top-3 text-[#616f89]" type="button">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <div className="h-1 flex-1 rounded bg-green-500"></div>
                    <div className="h-1 flex-1 rounded bg-green-500"></div>
                    <div className="h-1 flex-1 rounded bg-green-500"></div>
                    <div className="h-1 flex-1 rounded bg-gray-200"></div>
                  </div>
                  <p className="text-[12px] text-[#616f89]">보안 등급: <span className="text-green-600 font-semibold">강함</span></p>
                </div>
                
                <div className="pt-4 flex flex-col gap-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50" 
                    type="submit"
                  >
                      {loading ? '처리 중...' : '회원가입 완료'}
                  </button>
                  <div className="flex items-center justify-between">
                    <button className="text-sm font-semibold text-[#616f89] hover:text-[#111318] transition-colors flex items-center gap-1" type="button" onClick={() => navigate('/login')}>
                      <span className="material-symbols-outlined text-sm">arrow_back</span> 이전으로
                    </button>
                    <p className="text-sm text-[#616f89]">
                        이미 계정이 있으신가요? <Link to="/login" className="text-primary font-bold hover:underline">로그인</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-12 text-center text-xs text-[#616f89]">
            <p>© 2024 26 Center Property Management. 모든 권리 보유.</p>
            <div className="mt-2 flex justify-center gap-4">
              <Link to="/privacy" className="hover:underline">개인정보처리방침</Link>
              <Link to="/terms" className="hover:underline">이용약관</Link>
              <Link to="/support" className="hover:underline">고객센터</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;