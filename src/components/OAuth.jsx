import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../auth/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick(e) {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('could not authorize with Google');
      console.log(error);
    }
  }

  return (
    <button
      type='button'
      onClick={onGoogleClick}
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
