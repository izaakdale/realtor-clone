import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../auth/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCreds.user;
      updateProfile(user, { displayName: name });
      const formCopy = { ...formData };
      delete formCopy.password;
      formCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formCopy);
      // toast.success('Welcome to realtor-clone!');
      navigate('/');
    } catch (error) {
      toast.error('registration issue');
    }
  }

  return (
    <section>
      {/* <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1> */}
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
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='full name'
            />
            <input
              className='w-full px-4 py-2 mb-6 text-xl text-gray-500 placeholder:text-gray-300 bg-white border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='email address'
            />
            <div className='relative mb-6'>
              <input
                className='w-full px-4 py-2 text-xl text-gray-500 placeholder:text-gray-300 bg-white border-gray-300 rounded transition ease-in-out'
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='password'
              />
              {showPassword ? (
                <AiFillEye
                  className='absolute right-3 top-3 text-xl cursor-pointer text-gray-500'
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              ) : (
                <AiFillEyeInvisible
                  className='absolute right-3 top-3 text-xl cursor-pointer text-gray-300'
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              )}
            </div>
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
              <div className='text-blue-400 hover:text-blue-700 transition duration-200 ease-in-out text-sm'>
                <Link to='/forgot-password'>Forgot password?</Link>
              </div>
            </div>
            <button
              className='w-full text-sm font-semibold uppercase shadow-sm hover:shadow-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-gray-200 hover:text-white transition duration-200 ease-in-out rounded px-7 py-2'
              type='submit'
            >
              Sign Up
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
