import React from 'react';
import { Copy } from 'lucide-react';

export default function ProfileScreen() {
  return (
    <div className='px-6 pb-24 pt-8'>
      <div className='flex flex-col items-center mb-10'>
        <div className='relative group cursor-pointer'>
          <div className='w-28 h-28 rounded-full p-1 bg-white border-2 border-gray-100 shadow-lg overflow-hidden'>
            <img
              src={MOCK_USER.avatar}
              alt='Large Profile'
              className='w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110'
            />
          </div>
        </div>

        <h2 className='text-[28px] font-bold bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent mt-4'>
          {MOCK_USER.name}
        </h2>
        <span className='bg-gray-100 text-gray-500 text-xs px-4 py-1.5 rounded-full mt-2 font-medium'>
          {MOCK_USER.role}
        </span>
      </div>

      <div className='text-left w-full'>
        <h3 className='font-bold bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent text-[22px] mb-4'>
          Informasi Pribadi
        </h3>

        <div className='space-y-2 border-gray-100 shadow-sm px-8 py-2 rounded-2xl bg-[linear-gradient(to_right,#E2EBFF,#FFFFFF,#FFFFFF,#FFFFFF)]'>
          <div className=' flex justify-between items-center'>
            <span className='text-sm font-bold text-[#1D115A]'>NISN</span>
            <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
              <span className='text-sm font-semibold text-gray-700 tracking-wider'>
                {MOCK_USER.nisn}
              </span>
              <button className='p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1D115A] shadow-sm'>
                <Copy size={14} />
              </button>
            </div>
          </div>
          <hr />

          <div className='  flex justify-between items-center'>
            <span className='text-sm font-bold text-[#1D115A]'>NIS</span>
            <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
              <span className='text-sm font-semibold text-gray-700 tracking-wider'>
                {MOCK_USER.nis}
              </span>
              <button className='p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1D115A] shadow-sm'>
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 px-2'>
        <button className='w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2'>
          Log Out
        </button>
      </div>
    </div>
  );
}

const MOCK_USER = {
  name: 'Fanan Agfian Mozart',
  role: 'Murid',
  nisn: '123456789',
  nis: '123456789',
  avatar: 'https://i.pravatar.cc/150?u=mozart_student',
};
