import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
            <h1 className="text-3xl font-black text-[#111318] mb-8 pb-4 border-b border-[#f0f2f4]">서비스 이용약관</h1>
            
            <div className="prose max-w-none text-[#111318]">
                <h3 className="text-lg font-bold mb-3 mt-6">제1조 (목적)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    본 약관은 26센터(이하 '회사')가 제공하는 건물 관리 포털 서비스(이하 '서비스')의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
                </p>

                <h3 className="text-lg font-bold mb-3 mt-6">제2조 (용어의 정의)</h3>
                <ul className="list-disc list-inside text-sm text-[#616f89] mb-4 space-y-1 pl-2">
                    <li>"서비스"란 회사가 입주민에게 제공하는 온라인 자산 관리, 민원 신청, 공지 확인 등의 제반 서비스를 의미합니다.</li>
                    <li>"회원"이란 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                    <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</li>
                </ul>

                <h3 className="text-lg font-bold mb-3 mt-6">제3조 (약관의 효력 및 변경)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.<br/>
                    2. 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 본 약관을 개정할 수 있습니다.<br/>
                    3. 회원이 변경된 약관에 동의하지 않는 경우 회원 탈퇴를 요청할 수 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경 사항에 동의한 것으로 간주됩니다.
                </p>

                <h3 className="text-lg font-bold mb-3 mt-6">제4조 (서비스 이용 제한)</h3>
                <p className="text-sm text-[#616f89] leading-relaxed mb-4">
                    회사는 회원이 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 정지시킬 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-sm text-[#616f89] mb-4 space-y-1 pl-2">
                    <li>가입 신청 시 허위 내용을 등록한 경우</li>
                    <li>타인의 아이디 및 비밀번호를 도용한 경우</li>
                    <li>서비스 운영을 고의로 방해하거나 안정적 운영을 저해하는 경우</li>
                    <li>기타 관련 법령이나 회사가 정한 이용조건을 위배하는 경우</li>
                </ul>

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

export default TermsOfService;