import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // If not admin, redirect or show error (Access control handled in App.tsx/Route protection)
  
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111318] text-white flex flex-col sticky top-0 h-screen shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin') ? 'bg-primary text-white font-bold' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>대시보드</span>
          </Link>
          <Link 
            to="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/users') ? 'bg-primary text-white font-bold' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">group</span>
            <span>유저 관리</span>
          </Link>
          <Link 
            to="/admin/notices" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/notices') ? 'bg-primary text-white font-bold' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">campaign</span>
            <span>공지사항 관리</span>
          </Link>
          <Link 
            to="/admin/complaints" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/complaints') ? 'bg-primary text-white font-bold' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">feedback</span>
            <span>민원 관리</span>
          </Link>
          <Link 
            to="/admin/move-in-cards" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/move-in-cards') ? 'bg-primary text-white font-bold' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">badge</span>
            <span>입주카드 관리</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg mb-4">
             <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold">
               {user?.name?.[0] || 'A'}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold truncate">{user?.name || '관리자'}</p>
               <p className="text-[10px] text-gray-500 truncate">{user?.username}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {location.pathname.split('/').pop() === 'admin' ? 'Dashboard' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
             <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
             <Link to="/dashboard" className="text-primary hover:underline flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">home</span>
               홈페이지로 이동
             </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
