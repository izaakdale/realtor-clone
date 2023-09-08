import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  function onSignOutClick(e) {
    auth.signOut();
    navigate('/');
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form action=''>
            <input
              type='text'
              id='name'
              value={name}
              disabled={true}
              className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out duration-200'
            />
            <input
              type='text'
              id='email'
              value={email}
              disabled={true}
              className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out duration-200'
            />

            <div className='flex justify-between text-sm'>
              <p className='text-red-500 hover:text-red-700 cursor-pointer'>
                <span>Edit?</span>
              </p>
              <p
                onClick={onSignOutClick}
                className='text-blue-500 hover:text-blue-700 cursor-pointer'
              >
                Sign out?
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
