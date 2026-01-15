import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  users: number;
  pendingUsers: number;
  notices: number;
  complaints: number;
  pendingComplaints: number;
  moveInCards: number;
  pendingCards: number;
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({
    users: 0,
    pendingUsers: 0,
    notices: 0,
    complaints: 0,
    pendingComplaints: 0,
    moveInCards: 0,
    pendingCards: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you might have a single /api/admin/stats endpoint
        // For now, we'll fetch basic data if available or simulate
        const [usersRes, complaintsRes, cardsRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/move-in-cards', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const users = await usersRes.json();
        const complaints = await complaintsRes.json();
        const cards = await cardsRes.json();

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          pendingUsers: Array.isArray(users) ? users.filter((u: any) => !u.isVerified).length : 0,
          notices: 0, // Need to fetch separately if needed
          complaints: Array.isArray(complaints) ? complaints.length : 0,
          pendingComplaints: Array.isArray(complaints) ? complaints.filter((c: any) => c.status === 'Pending' || c.status === 'Processing').length : 0,
          moveInCards: Array.isArray(cards) ? cards.length : 0,
          pendingCards: Array.isArray(cards) ? cards.filter((c: any) => c.status === 'Pending').length : 0
        });
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    { title: '전체 사용자', value: stats.users, icon: 'group', color: 'blue', sub: `${stats.pendingUsers}명 미승인` },
    { title: '민원 현황', value: stats.complaints, icon: 'feedback', color: 'orange', sub: `${stats.pendingComplaints}건 미완료` },
    { title: '입주카드 신청', value: stats.moveInCards, icon: 'badge', color: 'green', sub: `${stats.pendingCards}건 미처리` },
    { title: '등록 공지사항', value: '-', icon: 'campaign', color: 'purple', sub: '최신순 정렬' },
  ];

  if (loading) {
     return <div className="flex items-center justify-center p-20 text-gray-400">Loading statistics...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">시스템 개요</h1>
           <p className="text-gray-500 mt-1">실시간 데이터 현황을 확인합니다.</p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-xl flex items-center justify-center text-${card.color}-600 bg-${card.color}-50`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">Total</span>
            </div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              <span className="text-sm text-gray-400">건</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
               <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                 <span className="size-1.5 rounded-full bg-red-400"></span>
                 {card.sub}
               </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">최근 가입 사용자</h3>
            <div className="text-sm text-gray-400 text-center py-10">
               사용자 관리 메뉴에서 상세 내역을 확인하세요.
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">처리 대기 중인 민원</h3>
            <div className="text-sm text-gray-400 text-center py-10">
               민원 관리 메뉴에서 상태를 업데이트하세요.
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
