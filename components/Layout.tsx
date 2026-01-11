import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#dbdfe6] bg-white px-6 py-3 md:px-10 lg:px-20">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-4 text-primary group">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <h2 className="text-[#111318] text-lg font-bold leading-tight">26 센터</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-9">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium leading-normal transition-colors ${isActive('/dashboard') ? 'text-primary font-bold' : 'text-[#111318] hover:text-primary'}`}
            >
              대시보드
            </Link>
            <Link 
              to="/notices" 
              className={`text-sm font-medium leading-normal transition-colors ${isActive('/notices') ? 'text-primary font-bold' : 'text-[#111318] hover:text-primary'}`}
            >
              공지사항
            </Link>
            <Link 
              to="/complaints" 
              className={`text-sm font-medium leading-normal transition-colors ${isActive('/complaints') ? 'text-primary font-bold' : 'text-[#111318] hover:text-primary'}`}
            >
              민원신청
            </Link>
             <Link 
              to="/access-card" 
              className={`text-sm font-medium leading-normal transition-colors ${isActive('/access-card') ? 'text-primary font-bold' : 'text-[#111318] hover:text-primary'}`}
            >
              입주카드
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-sm font-bold leading-normal transition-colors text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded"
              >
                관리자 모드
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
           <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden bg-[#f0f2f4]">
              <div className="text-[#616f89] flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 text-[#111318] placeholder:text-[#616f89] px-4 pl-2 text-sm" 
                placeholder="검색..." 
              />
            </div>
          </label>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-gray-100 text-[#111318]">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
             <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors group">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-gray-900 leading-none group-hover:text-primary transition-colors">{user?.name || '사용자'}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{user?.company || '입주자'}</p>
                </div>
                <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#dbdfe6] group-hover:border-primary transition-colors" 
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_W3w8ZaBJgGHOIdsAe6-01cXy5lMnHUoRDiHjY1VdA4XN3SYxSwFxnb6LuOsFAnnpCqIIjTPSHDsdjuaMY23UrZ4Wu-Yf__IQdzvOmtby6P5VK9K1wGz8HpC9ZpZZPgY4kltiJA7ya3L8f9Yr4Kin8n4i8B3iqHh81UpU_CXeNaLCZIDp9N_HtqAkuV9-Zqz7knQGQETl2VnDCmAPhn-eHrumuBdxOseeEuOSEdE8Lx7SUhaAWuFo42dYK7sYFfJy94uxemqqohw")'}}
                ></div>
             </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-red-50 text-[#616f89] hover:text-red-600 transition-colors ml-1"
              title="로그아웃"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#dbdfe6] py-8 px-10 bg-white text-center">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">domain</span>
                <span className="text-sm text-[#616f89]">© 2024 26 Center Property Management. All rights reserved.</span>
             </div>
            <div className="flex gap-6">
                <Link to="/privacy" className="text-xs text-[#616f89] hover:text-primary transition-colors">개인정보처리방침</Link>
                <Link to="/terms" className="text-xs text-[#616f89] hover:text-primary transition-colors">이용약관</Link>
                <Link to="/support" className="text-xs text-[#616f89] hover:text-primary transition-colors">고객센터</Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;