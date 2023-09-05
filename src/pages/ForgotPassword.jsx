import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
      navigate('/sign-in');
    } catch (error) {
      toast.error('Could not send reset password');
    }
  }

  return (
    <section>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img
            src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
            alt='key'
            className='w-full rounded-2xl'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input
              className='w-full px-4 py-2 mb-6 text-xl text-gray-500 placeholder:text-gray-300 bg-white border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='email address'
            />
            <div className='flex justify-between m-auto whitespace-nowrap sm:text-lg mb-6'>
              <div className='text-gray-500 text-sm'>
                Already a member?{' '}
                <Link
                  className='text-red-400 hover:text-red-700 transition duration-200 ease-in-out text-sm'
                  to='/sign-in'
                >
                  Sign in here!
                </Link>{' '}
              </div>
              <Link
                className='text-red-400 hover:text-red-700 transition duration-200 ease-in-out text-sm'
                to='/sign-up'
              >
                Register here!
              </Link>{' '}
            </div>
            <button
              className='w-full text-sm font-semibold uppercase shadow-sm hover:shadow-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-gray-200 hover:text-white transition duration-200 ease-in-out rounded px-7 py-2'
              type='submit'
            >
              Reset
            </button>
            <div className='my-4 before:border-t after:border-t flex before:flex-1 after:flex-1 items-center'>
              <p className='text-sm text-center font-semibold text-gray-400 mx-4'>
                OR
              </p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
