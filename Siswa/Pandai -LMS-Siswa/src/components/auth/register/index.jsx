import React, { useState } from 'react';

// components
import Input from '@/components/_shared/form/Input';
import Button from '@/components/_shared/Button';
import SocialButton from '../SocialButton';

// icons
import GoogleIcon from '../../icons/google';
import FacebookIcon from '../../icons/facebook';
import XIcon from '../../icons/x';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='flex flex-col h-full px-6 py-8 bg-white overflow-y-auto min-h-screen justify-center'>
      <div className='mt-8 mb-4'>
        <span className='bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-medium'>
          Register to your account
        </span>
      </div>

      <h1 className='text-[28px] font-bold mb-8 flex items-center gap-2 bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent'>
        Daftarkan akun anda!{' '}
        <div className='bg-logo-only bg-cover bg-no-repeat w-8 aspect-42/34'></div>
      </h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <Input type='text' placeholder='Name' />
        <Input type='email' placeholder='Email' />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder='Password'
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder='Konfirmasi Password'
        />

        <div className='flex items-center mb-8 ml-6'>
          <input
            id='show-pass-login'
            type='checkbox'
            className='w-4 h-4 text-[#5441FF] border-gray-300 rounded focus:ring-[#5441FF]'
            onChange={() => setShowPassword(!showPassword)}
          />
          <label
            htmlFor='show-pass-login'
            className='ml-2 text-base text-[#0f0c29] font-semibold'
          >
            Tunjukan password
          </label>
        </div>

        <Button
          text='Register'
          onClick={() => console.log('Register clicked')}
        />

        <p className='text-center text-base mt-6 font-semibold text-[#0f0c29]'>
          Sudah punya akun?{' '}
          <button className='text-[#0041C9] hover:underline font-bold'>
            Masuk
          </button>
        </p>

        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-400'>or sign in with</span>
          </div>
        </div>

        <div className='flex justify-center gap-4 mb-8'>
          <SocialButton icon={<GoogleIcon />} />
          <SocialButton icon={<FacebookIcon />} />
          <SocialButton icon={<XIcon />} />
        </div>
      </form>
    </div>
  );
}
