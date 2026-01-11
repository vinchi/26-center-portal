import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewComplaint: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/complaints');
    }

  return (
    <div className="max-w-[840px] mx-auto px-4 lg:px-0 py-8">
      <nav className="flex flex-wrap items-center gap-2 mb-6">
        <Link to="/dashboard" className="text-[#616f89] text-sm font-medium hover:text-primary transition-colors">홈</Link>
        <span className="text-[#616f89] text-sm">/</span>
        <Link to="/complaints" className="text-[#616f89] text-sm font-medium hover:text-primary transition-colors">민원신청</Link>
        <span className="text-[#616f89] text-sm">/</span>
        <span className="text-primary text-sm font-semibold">신규 민원 작성</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-[#111318] text-4xl font-black leading-tight tracking-[-0.033em]">26센터 민원신청 작성</h1>
        <p className="text-[#616f89] text-base font-normal mt-2">건물 관리단에 요청하실 민원 내용을 아래 양식에 맞춰 작성해 주세요.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <form className="p-6 md:p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-bold tracking-tight">
                카테고리 선택 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="appearance-none w-full rounded-lg text-[#111318] border border-[#dbdfe6] bg-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base font-normal leading-normal transition-all outline-none">
                  <option disabled selected value="">카테고리를 선택하세요</option>
                  <option value="maintenance">유지보수 및 수리</option>
                  <option value="security">보안 및 안전</option>
                  <option value="billing">관리비 및 수수료</option>
                  <option value="cleaning">미화 서비스</option>
                  <option value="amenity">편의시설 이용</option>
                  <option value="other">기타</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-bold tracking-tight">
                제목 <span className="text-red-500">*</span>
              </label>
              <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] bg-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base font-normal transition-all outline-none placeholder:text-[#616f89]" 
                placeholder="민원 제목을 요약하여 입력해 주세요" 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[#111318] text-sm font-bold tracking-tight">
              상세 내용 <span className="text-red-500">*</span>
            </label>
            <textarea 
                className="w-full min-h-[160px] rounded-lg text-[#111318] border border-[#dbdfe6] bg-white focus:border-primary focus:ring-1 focus:ring-primary p-4 text-base font-normal transition-all outline-none placeholder:text-[#616f89]" 
                placeholder="민원 내용을 상세히 입력해주세요"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#111318] text-sm font-bold tracking-tight">
              파일 업로드 (이미지 등)
            </label>
            <div className="relative group cursor-pointer border-2 border-dashed border-[#dbdfe6] rounded-xl bg-gray-50 hover:bg-primary/5 hover:border-primary transition-all p-10 flex flex-col items-center justify-center gap-3">
              <input className="absolute inset-0 opacity-0 cursor-pointer" multiple type="file" />
              <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="text-[#111318] font-semibold text-base">클릭하여 업로드하거나 파일을 여기로 끌어다 놓으세요</p>
                <p className="text-[#616f89] text-sm mt-1">민원 관련 사진을 첨부해 주세요 (JPG, PNG 최대 10MB)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
                className="w-full sm:w-auto px-6 h-12 flex items-center justify-center rounded-lg text-[#616f89] font-bold hover:bg-gray-100 transition-colors" 
                type="button"
                onClick={() => navigate('/complaints')}
            >
              취소
            </button>
            <button className="w-full sm:w-auto px-10 h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all" type="submit">
              접수하기
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-[#616f89] text-xs">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
        <p>접수된 민원은 고유 번호가 부여되며, 관리실에서 영업일 기준 24-48시간 이내에 검토 후 연락드립니다.</p>
      </div>
    </div>
  );
};

export default NewComplaint;