import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../auth/firebase';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const [editActive, setEditActive] = useState(false);

  function onSignOutClick(e) {
    auth.signOut();
    navigate('/');
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { name });
      toast.success('profile updated');
    } catch (error) {
      toast.error('error updating profile');
    }
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
              disabled={!editActive}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out duration-200 ${
                editActive && 'bg-red-100 text-gray-700'
              }`}
            />
            <input
              type='text'
              id='email'
              value={email}
              disabled
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out duration-200`}
            />

            <div className='flex justify-between text-sm'>
              <p
                onClick={() => {
                  editActive && onSubmit();
                  setEditActive(!editActive);
                }}
                className='text-red-500 hover:text-red-700 cursor-pointer'
              >
                <span>{editActive ? 'Apply changes' : 'Edit?'}</span>
              </p>
              <p
                onClick={onSignOutClick}
                className='text-blue-500 hover:text-blue-700 cursor-pointer'
              >
                Sign out?
              </p>
            </div>
          </form>

          <Link to='/create-listing'>
            <button
              type='submit'
              className='flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition ease-in-out text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:shadow-lg cursor-pointer'
            >
              <FcHome className='mr-2 p-1 text-3xl bg-red-200 rounded-full border-2' />
              Sell or rent your home
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
