import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserData {
  _id: string;
  username: string;
  name: string;
  email: string;
  company: string;
  room: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unverified'>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Fetched users data:', data);
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Unexpected data format for users:', data);
        setError('데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.message || '사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const toggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('정말 이 사용자를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => !u.isVerified);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-500 mt-1">시스템에 가입된 사용자 목록을 관리합니다.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             전체 ({users.length})
           </button>
           <button 
             onClick={() => setFilter('unverified')}
             className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${filter === 'unverified' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             미승인 ({users.filter(u => !u.isVerified).length})
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center w-16">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">사용자 정보</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">소속 / 호수</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">아이디 / 권한</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">승인 상태</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-red-500 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl">error</span>
                      <p>{error}</p>
                      <button 
                        onClick={() => fetchUsers()}
                        className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-all"
                      >
                        다시 시도
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">사용자가 없습니다.</td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400 text-sm text-center font-medium">{users.length - idx}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                           {user.name[0]}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-900">{user.name}</p>
                           <p className="text-xs text-gray-500">{user.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm text-gray-700">{user.company || '-'}</p>
                       <p className="text-xs text-gray-500">{user.room ? `${user.room}호` : '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-medium text-gray-700">{user.username}</p>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                         {user.role}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                         onClick={() => toggleVerify(user._id, user.isVerified)}
                         className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${user.isVerified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                       >
                         {user.isVerified ? '인증됨' : '미인증'}
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="상세 정보"
                          >
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                          <button 
                            onClick={() => deleteUser(user._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

export default UserManagement;
