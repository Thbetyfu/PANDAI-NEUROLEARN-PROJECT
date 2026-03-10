import React from 'react';

export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:
          'linear-gradient(90deg, #2A1F7A 0%, #000000 60%, #2A1F7A 100%)',
      }}
      className='w-full py-4 mt-6 rounded-3xl text-white text-xl font-bold tracking-wide shadow-lg hover:brightness-110 transition-all'
    >
      {text}
    </button>
  );
}
