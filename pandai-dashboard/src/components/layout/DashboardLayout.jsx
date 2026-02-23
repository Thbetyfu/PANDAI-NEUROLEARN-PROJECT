import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children, role = 'guru' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-[#F8F9FA]'>
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Header for Hamburger */}
      <div className='md:hidden p-4 flex items-center gap-4 bg-white border-b border-gray-100 sticky top-0 z-30'>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='p-2 text-slate-600 hover:bg-slate-50 rounded-lg'
        >
          <Menu size={24} />
        </button>
        <span className='font-bold text-slate-800 text-lg'>Pandai</span>
      </div>

      <main className={cn(
        'p-4 md:p-8 transition-all duration-300',
        'md:ml-64' // Desktop margin
      )}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
