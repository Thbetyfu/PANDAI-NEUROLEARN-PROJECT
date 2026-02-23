import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Users,
  FileText,
  BarChart2,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PandaLogo from '@/components/icons/PandaLogo';
import PandaiTextLogo from '@/components/icons/PandaiTextLogo';

const Sidebar = ({ role, isOpen, onClose }) => {
  const router = useRouter();

  // Menu Config berdasarkan Role
  const menus = {
    guru: [
      { name: 'Home', icon: Home, path: '/guru' },
      { name: 'Daftar Siswa', icon: Users, path: '/guru/daftar-siswa' },
      { name: 'Evaluasi', icon: FileText, path: '/guru/evaluasi' },
    ],
    waka: [
      { name: 'Home', icon: Home, path: '/waka' },
      { name: 'Statistik Guru', icon: Users, path: '/waka/statistik-guru' },
      {
        name: 'Statistik Kelas',
        icon: BarChart2,
        path: '/waka/statistik-kelas',
      },
    ],
    orang_tua: [
      { name: 'Home', icon: Home, path: '/orang-tua' },
      { name: 'Profil Anak', icon: Users, path: '/orang-tua/profile-anak' },
    ],
  };

  const activeMenu = menus[role] || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >


        {/* Logo Section */}
        <div className='p-8 relative'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <PandaLogo className="w-[30px] h-[30px]" />
              <PandaiTextLogo className="h-[17px] w-auto" />
            </div>

            {/* Close Button (Mobile Only) */}
            <button
              onClick={onClose}
              className='md:hidden p-1 text-slate-400 hover:text-slate-600'
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className='space-y-2'>
            {activeMenu.map((item, index) => {
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => onClose()} // Close sidebar on mobile when link clicked
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-slate-50 text-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer (Logout) */}
        <div className='p-6 border-t border-gray-50'>
          <div className='bg-slate-50 p-3 rounded-xl flex items-center gap-3 mb-3 cursor-pointer'>
            <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden'>
              {/* Placeholder Avatar */}
              <img
                src='https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
                alt='User'
              />
            </div>
            <div className='flex-1'>
              <h4 className='text-sm font-bold text-slate-800 capitalize'>
                {role === 'orang_tua'
                  ? 'Richard'
                  : role === 'waka'
                    ? 'Yanto'
                    : 'Budi'}
              </h4>
              <p className='text-xs text-slate-500 capitalize'>
                {role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button className='w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium'>
            <span>Log-Out</span>
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
