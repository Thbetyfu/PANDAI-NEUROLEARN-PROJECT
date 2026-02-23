export default function SocialButton({ icon }) {
  return (
    <button className='w-16 h-12 border border-blue-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors'>
      {icon}
    </button>
  );
}
