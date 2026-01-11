import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');

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
            <Link to="/login" className="text-[#111318] text-sm font-bold hover:text-primary transition-colors">
                로그인으로 돌아가기
            </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
            <div className="text-center">
                <h1 className="text-[#111318] text-2xl font-bold">계정 찾기</h1>
                <p className="text-[#616f89] text-sm mt-2">등록된 회원 정보를 통해 아이디 또는 비밀번호를 찾을 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#e5e7eb] overflow-hidden">
                <div className="flex border-b border-[#e5e7eb]">
                    <button 
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'id' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-[#616f89] hover:text-[#111318] hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('id')}
                    >
                        아이디 찾기
                    </button>
                    <button 
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'password' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-[#616f89] hover:text-[#111318] hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'id' ? (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">이름</label>
                                <input 
                                    className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                    placeholder="가입 시 등록한 이름" 
                                    type="text" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">이메일</label>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                        placeholder="등록된 이메일 주소" 
                                        type="email" 
                                    />
                                    <button className="px-4 h-12 border border-[#dbdfe6] rounded-lg text-sm font-bold text-[#616f89] hover:bg-gray-50 hover:text-[#111318] whitespace-nowrap transition-colors">
                                        인증번호 받기
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">인증번호</label>
                                <div className="relative">
                                    <input 
                                        className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                        placeholder="인증번호 6자리 입력" 
                                        type="text" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium">02:59</span>
                                </div>
                            </div>
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg transition-all shadow-lg shadow-primary/20 mt-4">
                                아이디 찾기
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">아이디</label>
                                <input 
                                    className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                    placeholder="가입된 아이디 입력" 
                                    type="text" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">이름</label>
                                <input 
                                    className="w-full rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                    placeholder="가입 시 등록한 이름" 
                                    type="text" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111318] text-sm font-semibold">휴대폰 번호</label>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 rounded-lg border-[#dbdfe6] text-[#111318] focus:ring-primary focus:border-primary h-12 px-4 text-base placeholder:text-[#616f89]" 
                                        placeholder="'-' 없이 입력" 
                                        type="tel" 
                                    />
                                    <button className="px-4 h-12 border border-[#dbdfe6] rounded-lg text-sm font-bold text-[#616f89] hover:bg-gray-50 hover:text-[#111318] whitespace-nowrap transition-colors">
                                        인증번호 받기
                                    </button>
                                </div>
                            </div>
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg transition-all shadow-lg shadow-primary/20 mt-4">
                                비밀번호 재설정
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="text-center text-xs text-[#616f89]">
                <p>문제가 해결되지 않나요?</p>
                <div className="mt-2 flex justify-center gap-2">
                    <span className="font-bold text-[#111318]">관리사무소 02-555-0226</span>
                    <span>또는</span>
                    <Link to="/support" className="text-primary hover:underline">고객센터 문의하기</Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default FindAccount;