import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  return (
    <button
      className='w-full flex items-center justify-center py-2 
    bg-blue-600 hover:bg-blue-700 active:bg-blue-800
    text-gray-200 hover:text-white font-semibold uppercase text-sm
    shadow-sm hover:shadow-lg
    rounded
    transition duration-200 ease-in-out'
    >
      Continue with <FcGoogle className='ml-2 text-xl bg-white rounded-xl' />
    </button>
  );
}
