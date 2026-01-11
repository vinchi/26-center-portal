import React from 'react';
import { Link } from 'react-router-dom';

const CustomerSupport: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <header className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-4 md:px-40 py-3 sticky top-0 z-50">
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
                홈으로
            </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-[#111318] mb-3">고객센터</h1>
            <p className="text-[#616f89]">26센터 이용 중 궁금한 점이나 불편한 사항이 있으신가요?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 flex flex-col items-center text-center">
                <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-2">전화 문의</h3>
                <p className="text-[#616f89] text-sm mb-6">평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
                <a href="tel:02-555-0226" className="text-2xl font-black text-primary hover:underline">02-555-0226</a>
                <p className="text-xs text-[#616f89] mt-2">주말 및 공휴일 휴무</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 flex flex-col items-center text-center">
                <div className="size-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-2">이메일 문의</h3>
                <p className="text-[#616f89] text-sm mb-6">24시간 접수 가능 (순차적 답변)</p>
                <a href="mailto:support@26center.com" className="text-2xl font-black text-[#111318] hover:text-primary transition-colors">support@26center.com</a>
                <p className="text-xs text-[#616f89] mt-2">평균 답변 시간: 24시간 이내</p>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 md:p-10">
            <h3 className="text-xl font-bold text-[#111318] mb-6">1:1 문의하기</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('문의가 접수되었습니다.'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#111318] text-sm font-bold">이름</label>
                        <input className="w-full rounded-lg border-[#dbdfe6] h-12 px-4 focus:ring-primary focus:border-primary" placeholder="성함을 입력하세요" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#111318] text-sm font-bold">연락처</label>
                        <input className="w-full rounded-lg border-[#dbdfe6] h-12 px-4 focus:ring-primary focus:border-primary" placeholder="연락 받으실 번호" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[#111318] text-sm font-bold">이메일</label>
                    <input className="w-full rounded-lg border-[#dbdfe6] h-12 px-4 focus:ring-primary focus:border-primary" type="email" placeholder="답변 받으실 이메일" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[#111318] text-sm font-bold">문의 내용</label>
                    <textarea className="w-full rounded-lg border-[#dbdfe6] h-32 p-4 focus:ring-primary focus:border-primary resize-none" placeholder="문의하실 내용을 자세히 적어주세요"></textarea>
                </div>
                
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="agree" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <label htmlFor="agree" className="text-sm text-[#616f89]">
                        <Link to="/privacy" className="text-primary hover:underline font-semibold">개인정보 수집 및 이용</Link>에 동의합니다.
                    </label>
                </div>

                <button type="submit" className="w-full md:w-auto px-8 h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    문의하기
                </button>
            </form>
        </div>
      </main>
      
      <footer className="border-t border-[#dbdfe6] py-8 bg-white text-center">
        <p className="text-xs text-[#616f89]">© 2024 26 Center Property Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerSupport;