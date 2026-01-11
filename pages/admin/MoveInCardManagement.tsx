import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface CardData {
  _id: string;
  user: {
    username: string;
    name: string;
  };
  name: string;
  phone: string;
  room: string;
  vehicleCount: number;
  status: 'Pending' | 'Processing' | 'Approved' | 'Rejected';
  createdAt: string;
}

const MoveInCardManagement: React.FC = () => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/move-in-cards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCards(data);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [token]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/move-in-cards/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCards();
      }
    } catch (err) {
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const deleteCard = async (id: string) => {
    if (!window.confirm('정말 이 신청 기록을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/move-in-cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCards();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입주카드 관리</h1>
        <p className="text-gray-500 mt-1">입주카드 및 주차 등록 신청 내역을 심사합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center w-32">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">신청자 정보</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">연락처 / 호수</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">차량</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">신청일</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-400">Loading requests...</td></tr>
               ) : cards.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-400">신청 내역이 없습니다.</td></tr>
               ) : (
                 cards.map((card) => (
                   <tr key={card._id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <select 
                          value={card.status}
                          onChange={(e) => updateStatus(card._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border outline-none cursor-pointer transition-colors ${
                            card.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-700' :
                            card.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                            card.status === 'Processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <option value="Pending">접수대기</option>
                          <option value="Processing">처리중</option>
                          <option value="Approved">승인</option>
                          <option value="Rejected">반려</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{card.name}</p>
                        <p className="text-[10px] text-gray-400">Account: {card.user?.username || 'deleted'}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-gray-700">{card.phone}</p>
                         <p className="text-xs text-gray-500 font-medium">{card.room}호</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                           <span className="material-symbols-outlined text-gray-400 text-base">directions_car</span>
                           <span className="font-bold text-gray-700">{card.vehicleCount}대</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2 text-gray-400">
                            <button 
                              className="p-2 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                              title="상세보기"
                            >
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <button 
                              onClick={() => deleteCard(card._id)}
                              className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="삭제"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoveInCardManagement;
