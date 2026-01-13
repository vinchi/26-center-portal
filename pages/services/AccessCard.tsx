import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccessCard: React.FC = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [company, setCompany] = useState('');
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Vehicle State
  const [vehicles, setVehicles] = useState<{ number: string; model: string }[]>([]);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with User Data
  useEffect(() => {
    if (user) {
      setCompany(user.company || '');
      setRoom(user.room || '');
      setName(user.name || '');
      setEmployeeId(user.employeeId || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.vehicles) {
        setVehicles(user.vehicles);
      }
    }
  }, [user]);

  const handleAddVehicle = () => {
    if (!newVehicleNumber || !newVehicleModel) {
      alert('차량 번호와 모델을 모두 입력해주세요.');
      return;
    }
    setVehicles([...vehicles, { number: newVehicleNumber, model: newVehicleModel }]);
    setNewVehicleNumber('');
    setNewVehicleModel('');
  };

  const handleRemoveVehicle = (index: number) => {
    const updated = vehicles.filter((_, i) => i !== index);
    setVehicles(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/access-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company,
          room,
          employeeId,
          phone,
          vehicles
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local auth context with new user data
        if (data.user) {
            login(token!, data.user);
        }
        alert('신청이 성공적으로 완료되었습니다.');
        navigate('/profile');
      } else {
        setError(data.message || '신청 실패');
      }
    } catch (err) {
      console.error(err);
      setError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#111318] text-4xl font-black leading-tight tracking-[-0.033em]">26센터 입주카드 신청</p>
          <p className="text-[#616f89] text-base font-normal leading-normal">건물 출입 및 주차 권한 등록을 위해 아래 양식을 작성해 주세요.</p>
        </div>
      </div>

      <div className="bg-white border border-[#f0f2f4] rounded-xl shadow-sm overflow-hidden mb-8">
        <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 pb-3 pt-8">업체 정보</h2>
        <div className="flex flex-wrap items-end gap-4 px-6 py-4">
          <label className="flex flex-col w-full sm:flex-1 min-w-[200px]">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">업체명</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                placeholder="업체명을 입력하세요" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
          </label>
          <label className="flex flex-col w-full sm:w-auto sm:min-w-[120px] sm:max-w-[200px]">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">호수</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                placeholder="예: 402호" 
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />
          </label>
        </div>
        <div className="px-6 py-4">
          <label className="flex flex-col w-full">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">담당자 성함 (자동입력)</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] bg-gray-50 h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                value={name}
                disabled
            />
          </label>
        </div>

        <div className="h-px bg-[#f0f2f4] mx-6 my-4"></div>

        <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 pb-3 pt-5">임직원 정보</h2>
        <div className="flex flex-wrap items-end gap-4 px-6 py-4">
          <label className="flex flex-col w-full sm:flex-1 min-w-[200px]">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">사원 번호</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                placeholder="EMP-0000" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-4 px-6 py-4">
          <label className="flex flex-col w-full sm:flex-1 min-w-[240px]">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">이메일 주소</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] bg-gray-50 h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                value={email}
                disabled
            />
          </label>
          <label className="flex flex-col w-full sm:flex-1 min-w-[240px]">
            <p className="text-[#111318] text-base font-medium leading-normal pb-2">전화번호</p>
            <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-14 px-4 text-base placeholder:text-[#616f89] focus:ring-primary focus:border-primary" 
                placeholder="010-0000-0000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>

        <div className="h-px bg-[#f0f2f4] mx-6 my-4"></div>

        <div className="flex items-center justify-between px-6 pb-3 pt-5">
          <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em]">주차 차량 등록</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">총 등록 차량: {vehicles.length}대</span>
        </div>

        <div className="mx-6 mb-6 p-4 rounded-xl border border-dashed border-[#dbdfe6] bg-background-light">
          <p className="text-sm font-semibold text-[#616f89] mb-3 uppercase tracking-wider">신규 차량 추가</p>
          <div className="flex flex-col md:flex-row flex-wrap items-end gap-4">
            <label className="flex flex-col w-full md:flex-1 min-w-[200px]">
              <p className="text-[#111318] text-sm font-medium leading-normal pb-1">차량번호</p>
              <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-11 px-4 text-sm focus:ring-primary focus:border-primary" 
                placeholder="예: 123가 4567" 
                value={newVehicleNumber}
                onChange={(e) => setNewVehicleNumber(e.target.value)}
              />
            </label>
            <label className="flex flex-col w-full md:flex-1 min-w-[200px]">
              <p className="text-[#111318] text-sm font-medium leading-normal pb-1">차량모델</p>
              <input 
                className="w-full rounded-lg text-[#111318] border border-[#dbdfe6] h-11 px-4 text-sm focus:ring-primary focus:border-primary" 
                placeholder="예: 현대 그랜저 (화이트)" 
                value={newVehicleModel}
                onChange={(e) => setNewVehicleModel(e.target.value)}
              />
            </label>
            <button 
                onClick={handleAddVehicle}
                className="w-full md:w-auto h-11 px-6 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              + 차량 추가
            </button>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="overflow-hidden border border-[#f0f2f4] rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-background-light">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#616f89]">차량번호</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#616f89]">차량모델</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#616f89] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f4]">
                {vehicles.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">등록된 차량이 없습니다.</td>
                    </tr>
                ) : (
                    vehicles.map((v, i) => (
                        <tr key={i}>
                            <td className="px-4 py-4 text-sm font-medium">{v.number}</td>
                            <td className="px-4 py-4 text-sm text-[#616f89]">{v.model}</td>
                            <td className="px-4 py-4 text-right">
                                <button 
                                    onClick={() => handleRemoveVehicle(i)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-background-light p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input className="w-5 h-5 rounded border-[#dbdfe6] text-primary focus:ring-primary" type="checkbox" />
            <span className="text-sm text-[#616f89]">서비스 이용 약관 및 건물 안전 수칙에 동의합니다.</span>
          </label>
          <div className="flex gap-4 w-full md:w-auto">
             {error && <div className="text-red-500 text-sm font-bold flex items-center">{error}</div>}
            <button 
                onClick={() => alert('임시 저장 기능은 준비중입니다.')}
                className="flex-1 md:flex-none px-8 h-12 bg-white border border-[#dbdfe6] text-[#111318] rounded-lg font-bold text-base hover:bg-gray-50 transition-colors"
            >
              임시 저장
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 md:flex-none px-8 h-12 bg-primary text-white rounded-lg font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? '처리중...' : '신청하기'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <h3 className="font-bold text-lg">건물 위치</h3>
          </div>
          <div className="aspect-video w-full rounded-lg bg-gray-100 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArTbZf16O3VuNR2AfuRnk86lEVHr8LfToIsGAXL2ddbCH3fh_XF90vodaK5Hu1UBTbPkmcTpsuztnQTXuEZh97G35Be274PZm2Kn2MFVyGxNbgm-J8CfDmmg7AgNfUvMzl0adLK0tLxq-s0RbfJaYCPlAOwYGjVaIiml3HBebTEd4luUrSuCDv3Tza1Qu6tMcVfxcu4zupgxj5XzawdWilurz3mYbY70s77_cLHUeVicCXkCtTSSoCmP1n7bCW1zuGn0mJarIREK4" alt="Building location map" />
            </div>
          </div>
          <p className="mt-4 text-sm text-[#616f89]">서울특별시장 26센터 플라자, 비즈니스 지구 10001</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <h3 className="font-bold text-lg">도움이 필요하신가요?</h3>
          </div>
          <p className="text-sm text-[#616f89] mb-6 leading-relaxed">신청 과정에 어려움이 있거나 주차 등급에 대해 궁금한 점이 있으시면 지원팀에 문의해 주세요.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">phone</span>
              <span className="font-medium">02-555-0226</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
              <span className="font-medium">support@26center.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;