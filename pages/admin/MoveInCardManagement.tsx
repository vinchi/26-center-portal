import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCards = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('/api/admin/move-in-cards', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        logout();
        navigate('/admin/login');
        return;
      }

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
    if (token) fetchCards();
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
        if (selectedCard && selectedCard._id === id) {
          setSelectedCard({ ...selectedCard, status: newStatus as any });
        }
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
        setShowModal(false);
        fetchCards();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const openDetail = (card: CardData) => {
    setSelectedCard(card);
    setShowModal(true);
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
                      <td className="px-6 py-4 cursor-pointer" onClick={() => openDetail(card)}>
                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{card.name}</p>
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
                              onClick={() => openDetail(card)}
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

      {/* Detail Modal */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div>
                  <h2 className="text-xl font-bold text-gray-900">입주카드 신청 상세</h2>
                  <p className="text-xs text-gray-500 mt-1">접수번호: {selectedCard._id}</p>
               </div>
               <button onClick={() => setShowModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </header>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">신청 상태</p>
                   <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedCard.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        selectedCard.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        selectedCard.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedCard.status === 'Approved' ? '승인됨 (입주 처리 완료)' :
                         selectedCard.status === 'Rejected' ? '반려됨' :
                         selectedCard.status === 'Processing' ? '심사중' : '접수 대기중'}
                     </span>
                     {selectedCard.status === 'Approved' && <span className="text-xs text-green-600 font-medium">✨ 해당 사용자의 정보가 입주카드 데이터로 업데이트되었습니다.</span>}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">성명</p>
                    <p className="text-base font-bold text-gray-900">{selectedCard.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">계정 (ID)</p>
                    <p className="text-base font-bold text-gray-900">{selectedCard.user?.username || '-'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">입주 호수</p>
                    <p className="text-base font-bold text-gray-900">{selectedCard.room}호</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">연락처</p>
                    <p className="text-base font-bold text-gray-900">{selectedCard.phone}</p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="material-symbols-outlined text-gray-400">directions_car</span>
                       <p className="text-sm font-bold text-gray-700">등록 신청 차량 ({selectedCard.vehicleCount}대)</p>
                    </div>
                    {/* Note: The mock API currently only stores count, not details. If backend is updated to store vehicles array, we can map here. */}
                    <p className="text-gray-500 text-sm pl-8">
                       상세 차량 번호 정보는 추후 업데이트 예정입니다. (현재 데이터: {selectedCard.vehicleCount}대)
                    </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(selectedCard._id, 'Approved')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${selectedCard.status === 'Approved' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      승인 처리
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedCard._id, 'Rejected')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${selectedCard.status === 'Rejected' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      반려 처리
                    </button>
                 </div>
                 <button 
                   onClick={() => deleteCard(selectedCard._id)}
                   className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                 >
                   기록 삭제
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveInCardManagement;
