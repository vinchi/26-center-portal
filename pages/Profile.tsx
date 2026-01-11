import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, token, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      alert('이미지 파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      try {
        const response = await fetch('/api/users/photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profileImage: base64 })
        });

        const data = await response.json();
        if (response.ok) {
           if (token && data.user) {
             login(token, data.user); // Update context with new user data
           }
           alert('프로필 사진이 변경되었습니다.');
        } else {
            alert(data.message || '사진 업로드 실패');
        }
      } catch (err) {
        console.error('Photo upload error', err);
        alert('서버 오류가 발생했습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Date formatter
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch {
        return '-';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4 sm:px-10">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoChange} 
        className="hidden" 
        accept="image/*"
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link to="/dashboard" className="text-[#616f89] text-sm font-medium hover:text-primary transition-colors">홈</Link>
        <span className="text-[#616f89] text-sm">/</span>
        <span className="text-[#111318] text-sm font-semibold">내 정보</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Profile Card */}
        <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm overflow-hidden h-fit">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          <div className="px-6 pb-6 relative">
            <div className={`size-24 rounded-full border-4 border-white bg-cover bg-center absolute -top-12 shadow-md bg-gray-200`}
                 style={{backgroundImage: user?.profileImage ? `url(${user.profileImage})` : undefined}}>
                 {!user?.profileImage && <div className="h-full w-full flex items-center justify-center text-4xl text-gray-400 font-bold">{user?.name?.charAt(0)}</div>}
            </div>
            <div className="pt-16 flex flex-col items-center text-center">
               <h2 className="text-xl font-bold text-[#111318]">{user?.name || '사용자'}</h2>
               <p className="text-[#616f89] text-sm font-medium mb-4">{user?.company ? '입주사 (Tenant)' : '관리자 (Manager)'}</p>
               
               <div className="flex gap-2 mb-6">
                 <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">인증회원</span>
                 {user?.room && <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{user.room}</span>}
               </div>

               <div className="w-full space-y-3">
                 <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                   <span className="text-[#616f89]">가입일</span>
                   <span className="font-semibold text-[#111318]">{formatDate(user?.createdAt)}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                   <span className="text-[#616f89]">최근 접속</span>
                   <span className="font-semibold text-[#111318]">{formatDate(user?.lastLogin)}</span>
                 </div>
               </div>
               
               <button 
                onClick={handlePhotoClick}
                className="mt-6 w-full py-2.5 rounded-lg border border-[#dbdfe6] text-[#111318] font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
               >
                 <span className="material-symbols-outlined text-lg">photo_camera</span>
                 사진 변경
               </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm p-6 sm:p-8">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#111318] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">badge</span>
                기본 정보
              </h3>
              <button className="text-primary text-sm font-bold hover:underline">수정하기</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">이름</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">{user?.name}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">소속 / 회사명</label>
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">{user?.company || '-'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">아이디</label>
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">{user?.username}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">호실 정보</label>
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">{user?.room || '-'}</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
           <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#111318] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_phone</span>
                연락처 정보
              </h3>
               <button className="text-primary text-sm font-bold hover:underline">수정하기</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">이메일</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">
                  <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                  {user?.email}
                </div>
              </div>
               <div className="space-y-1">
                <label className="text-xs font-semibold text-[#616f89] uppercase">휴대전화</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">
                   <span className="material-symbols-outlined text-gray-400 text-lg">smartphone</span>
                   {user?.phone || '-'}
                </div>
              </div>
               <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-[#616f89] uppercase">사무실 전화</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-[#111318] font-medium">
                   <span className="material-symbols-outlined text-gray-400 text-lg">call</span>
                   02-555-0226 (내선 304)
                </div>
              </div>
            </div>
          </div>
          
           {/* Additional Info */}
           <div className="bg-white rounded-xl border border-[#dbdfe6] shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#111318] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_parking</span>
                등록 차량 및 카드키
              </h3>
            </div>
            
            <div className="space-y-4">
            {user?.vehicles && user.vehicles.length > 0 ? (
                user.vehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-[#dbdfe6] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">directions_car</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#111318]">{vehicle.number}</p>
                        <p className="text-xs text-[#616f89]">{vehicle.model} • 정기주차</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">등록됨</span>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-[#dbdfe6] rounded-lg text-center text-gray-500 text-sm">
                  등록된 차량이 없습니다.
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 border border-[#dbdfe6] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#111318]">출입 카드키 (메인)</p>
                    <p className="text-xs text-[#616f89]">{user?.accessCardId ? `S/N: ${user.accessCardId}` : '발급된 카드가 없습니다'}</p>
                  </div>
                </div>
                {user?.accessCardId ? (
                   <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">활성</span>
                ) : (
                   <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded">미발급</span>
                )}
              </div>
            </div>
            
             <div className="mt-6 flex justify-end">
                <Link to="/access-card" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                   차량/카드 관리 바로가기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;