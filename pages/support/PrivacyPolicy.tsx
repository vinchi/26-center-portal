import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 md:p-12">
            <h1 className="text-3xl font-black text-[#111318] mb-8 pb-4 border-b border-[#f0f2f4]">개인정보처리방침</h1>
            
            <div className="prose max-w-none text-[#111318]">
                <h3 className="text-lg font-bold mb-3 mt-6">제1조 (목적)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    26센터(이하 '회사')는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
                </p>

                <h3 className="text-lg font-bold mb-3 mt-6">제2조 (수집하는 개인정보 항목)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    회사는 입주민 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc list-inside text-sm text-[#616f89] mb-4 space-y-1 pl-2">
                    <li>필수항목: 이름, 아이디, 비밀번호, 휴대전화번호, 이메일, 입주 호실 정보</li>
                    <li>선택항목: 차량번호, 직급, 부서명</li>
                    <li>자동수집항목: 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                </ul>

                <h3 className="text-lg font-bold mb-3 mt-6">제3조 (개인정보의 처리목적)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                </p>
                <ul className="list-disc list-inside text-sm text-[#616f89] mb-4 space-y-1 pl-2">
                    <li>입주민 본인 확인 및 회원 관리</li>
                    <li>공지사항 전달, 민원 처리, 고지사항 전달</li>
                    <li>주차 관리 및 출입 카드 발급 시스템 운영</li>
                    <li>서비스 부정 이용 방지 및 비인가 사용 방지</li>
                </ul>

                <h3 className="text-lg font-bold mb-3 mt-6">제4조 (개인정보의 보유 및 이용기간)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    <br/>
                    - 회원 가입 정보: 퇴거 시 또는 회원 탈퇴 시까지
                    <br/>
                    - 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
                </p>

                <div className="mt-8 pt-8 border-t border-[#f0f2f4]">
                    <p className="text-xs text-[#616f89]">
                        공고일자: 2023년 10월 01일<br/>
                        시행일자: 2023년 10월 01일
                    </p>
                </div>
            </div>
        </div>
      </main>
      
      <footer className="border-t border-[#dbdfe6] py-8 bg-white text-center">
        <p className="text-xs text-[#616f89]">© 2024 26 Center Property Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;