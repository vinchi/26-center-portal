import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [notices, setNotices] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState<any>(null);

  React.useEffect(() => {
    // Fetch notices
    fetch('/api/notices?limit=4')
      .then(res => res.json())
      .then(data => {
        setNotices(data.notices || []);
      })
      .catch(err => console.error('Dashboard Notice Fetch Error:', err));

    // Fetch building status
    fetch('/api/building-status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
      })
      .catch(err => console.error('Dashboard Status Fetch Error:', err));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case '안전': return 'red';
      case '일반': return 'blue';
      case '점검': return 'orange';
      case '행사': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full px-4 sm:px-10 py-8">
      {/* Banner */}
      <section className="@container mb-2">
        <div className="relative min-h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group bg-[#f4f1ea]">
          {/* Vivid Background Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: 'url("/images/hero_building_wide.png")' }}
          ></div>
          
          {/* Subtle overlay to match building background */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

          {/* Focused Building Layer (Optional: if you want to keep it layered, but cover is fine for wide) */}
          <div 
            className="absolute inset-x-0 inset-y-0 bg-cover bg-center z-10 transition-transform duration-700 group-hover:scale-[1.01]"
            style={{ backgroundImage: 'url("/images/hero_building_wide.png")' }}
          ></div>

          {/* Darker Side Gradients to frame the building and fill width visually */}
          <div className="absolute inset-0 z-15 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

          {/* Bottom Gradient & Content Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end px-8 pb-14 sm:px-16 gap-6">
            <div className="flex flex-col gap-4 text-left max-w-2xl">
              <span className="bg-primary px-4 py-1.5 rounded-full text-white text-xs font-extrabold uppercase tracking-widest w-fit shadow-lg">빌딩 업데이트</span>
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-6xl drop-shadow-2xl">
                  26 센터의<br/>새로운 시작
              </h1>
              <p className="text-gray-100 text-base sm:text-xl font-medium leading-relaxed drop-shadow-lg max-w-lg">
                  모던한 감성과 프리미엄 서비스가 만나는 곳. <br/>
                  26 센터에서의 특별한 일상을 확인해 보세요.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/notices" className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold tracking-[0.015em] hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                <span className="truncate">공지사항 보기</span>
              </Link>
              <Link to="/complaints" className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white/10 backdrop-blur-md text-white border border-white/30 text-lg font-bold tracking-[0.015em] hover:bg-white/20 transition-all shadow-xl active:scale-95">
                <span className="truncate">민원 신청</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: 'campaign', title: '공지사항', desc: '안전 및 규정에 관한 주요 안내사항을 확인하세요.', link: '/notices' },
          { icon: 'edit_note', title: '민원신청', desc: '시설 보수 및 행정 서비스에 대한 요청을 접수하세요.', link: '/complaints' },
          { icon: 'badge', title: '입주카드', desc: '디지털 출입증, 주차 및 편의 시설 패스를 관리하세요.', link: '/access-card' },
          { icon: 'calendar_month', title: '시설예약', desc: '회의실 및 커뮤니티 공간 예약을 간편하게 이용하세요.', link: '/dashboard' },
        ].map((item, index) => (
          <Link to={item.link} key={index} className="flex flex-1 gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 flex-col hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="bg-primary/10 p-3 rounded-lg w-fit text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl">{item.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111318] text-lg font-bold">{item.title}</h2>
              <p className="text-[#616f89] text-sm font-normal">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Content Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
        {/* Notices Table */}
        <div className="lg:col-span-2 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#111318] text-2xl font-bold leading-tight">최근 공지사항</h2>
            <Link to="/notices" className="text-primary text-sm font-semibold hover:underline">전체 보기</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#dbdfe6] bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[#111318] text-sm font-semibold">제목</th>
                  <th className="px-6 py-4 text-[#111318] text-sm font-semibold">카테고리</th>
                  <th className="px-6 py-4 text-[#111318] text-sm font-semibold">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notices.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-[#111318] text-sm font-medium">
                      <Link to={`/notices/${row._id}`} className="hover:text-primary transition-colors">
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold bg-${getNoticeColor(row.type)}-100 text-${getNoticeColor(row.type)}-700`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#616f89] text-sm">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
                {notices.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-sm">최근 공지사항이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Complaint Status Stats */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#111318] text-2xl font-bold leading-tight">민원 처리 현황</h2>
              <Link to="/complaints" className="text-primary text-sm font-semibold hover:underline">상세 보기</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#dbdfe6] p-4 rounded-xl text-center">
                <div className="text-[#616f89] text-sm mb-1">접수</div>
                <div className="text-2xl font-bold text-[#111318]">{status?.pendingComplaintsCount || 0}건</div>
              </div>
              <div className="bg-white border border-[#dbdfe6] p-4 rounded-xl text-center">
                <div className="text-primary text-sm mb-1 font-semibold">처리중</div>
                <div className="text-2xl font-bold text-primary">{status?.processingComplaintsCount || 0}건</div>
              </div>
              <div className="bg-white border border-[#dbdfe6] p-4 rounded-xl text-center">
                <div className="text-green-600 text-sm mb-1">완료</div>
                <div className="text-2xl font-bold text-green-600">{status?.completeComplaintsCount || 0}건</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="w-full flex flex-col gap-4">
           <h2 className="text-[#111318] text-2xl font-bold leading-tight mb-0 lg:mb-4">빌딩 현황</h2>
          
          {/* Parking Widget */}
          <div className="bg-white border border-[#dbdfe6] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_parking</span>
                <span className="text-sm font-bold">주차 현황</span>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">실시간</span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-black">{status?.parking.percent || 0}%</span>
              <span className="text-xs text-[#616f89]">남은 주차면: {status ? status.parking.total - status.parking.occupied : 0}/{status?.parking.total || 60}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${status?.parking.percent || 0}%` }}></div>
            </div>
          </div>

          {/* Elevator Widget */}
          <div className="bg-white border border-[#dbdfe6] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">engineering</span>
              <span className="text-sm font-bold">엘리베이터 점검 안내</span>
            </div>
            <div className="space-y-4">
              {status?.elevators.map((elv: any) => (
                <div key={elv.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${elv.status === 'Normal' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm">{elv.name}</span>
                  </div>
                  <span className={`text-xs font-semibold ${elv.status === 'Normal' ? 'text-green-600' : 'text-orange-600'}`}>
                    {elv.note}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">메인 로비 공조 장치</span>
                </div>
                <span className="text-xs font-semibold text-green-600">최적 가동</span>
              </div>
            </div>
          </div>

          {/* Help Widget */}
          <div className="bg-primary p-5 rounded-xl text-white">
            <h3 className="font-bold text-lg mb-2">도움이 필요하신가요?</h3>
            <p className="text-white/80 text-sm mb-4">관리사무소는 오늘 오후 6시까지 운영됩니다.</p>
            <Link to="/support" className="flex w-full py-2 bg-white text-primary rounded-lg items-center justify-center font-bold text-sm hover:bg-gray-100 transition-colors">
                관리사무소 문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;