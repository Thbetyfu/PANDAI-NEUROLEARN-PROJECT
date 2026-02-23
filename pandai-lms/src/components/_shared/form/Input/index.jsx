export default function Input({ type, placeholder, value, onChange }) {
  return (
    <div className='w-full mb-4'>
      <input
        type={type}
        placeholder={placeholder}
        className='w-full px-6 py-4 rounded-3xl border border-[#5441FF] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5441FF] focus:border-transparent transition-all'
      />
    </div>
  );
}
