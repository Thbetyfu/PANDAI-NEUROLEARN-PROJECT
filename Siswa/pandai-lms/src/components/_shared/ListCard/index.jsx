import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function ListCard({
  title,
  description,
  extendsDescription,
  onClick,
  icon,
  variant = 'default',
  isOpen, // Tambahan prop untuk mengetahui status card (terbuka/tutup)
  children, // Tambahan prop untuk konten JSX (seperti Video)
}) {
  if (variant === 'extended') {
    return (
      <div
        className={`rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 bg-white group hover:shadow-md transition-shadow mb-4 ${
          isOpen ? 'ring-2 ring-blue-100' : ''
        }`}
      >
        <div
          className='p-5 flex justify-between items-center cursor-pointer'
          onClick={onClick}
        >
          <div className='flex gap-4 items-center'>
            {/* MODIFIKASI 1: Icon Flexibel. Hanya render jika prop 'icon' ada */}
            {icon && (
              <div
                className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300 bg-cover bg-no-repeat ${icon}`}
              ></div>
            )}

            <div>
              <h4 className='font-bold text-lg text-[#0f0c29] mb-1'>{title}</h4>
              <span
                className={`px-4 py-1 rounded-full text-xs font-medium ${
                  description.includes('Dipelajari') ||
                  description.includes('Dikerjakan')
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {description}
              </span>
            </div>
          </div>

          <button className='p-2 hover:bg-gray-50 rounded-full transition-colors'>
            {isOpen ? (
              <ChevronDown size={28} className='text-gray-600' />
            ) : (
              <ChevronRight size={28} className='text-gray-600' />
            )}
          </button>
        </div>

        {children ? (
          <div className='w-full'>{children}</div>
        ) : (
          extendsDescription && (
            <button className='w-full bg-gradient-to-b from-black to-[#0041C9] text-white py-4 px-5 flex justify-between items-center hover:bg-[#003B7B] transition-colors'>
              <span className='text-xs font-bold tracking-wide'>
                {extendsDescription}
              </span>
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className='bg-[linear-gradient(to_right,#E2EBFF,#FFFFFF,#FFFFFF,#FFFFFF)] p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-blue transition-colors cursor-pointer group'
    >
      <div className='flex items-center gap-4'>
        {/* MODIFIKASI 1: Icon Flexibel di variant default juga */}
        {icon && (
          <div
            className={`w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-cover bg-no-repeat ${icon}`}
          ></div>
        )}

        <div>
          <h4 className='font-bold text-sm text-[#0f0c29] mb-1'>{title}</h4>
          {/* Sedikit penyesuaian warna badge supaya mirip desain target */}
          <span
            className={`px-4 py-1 rounded-full text-xs font-medium ${
              description.includes('Dipelajari') ||
              description.includes('Dikerjakan')
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {description}
          </span>
        </div>
      </div>
      <ChevronRight
        size={20}
        className='text-gray-300 group-hover:text-primary-blue'
      />
    </div>
  );
}
