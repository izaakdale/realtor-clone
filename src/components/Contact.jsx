import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../auth/firebase';
import { toast } from 'react-toastify';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, 'users', listing.userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('unable to get landlord data');
      }
    }
    getLandlord();
  }, [listing]);

  return (
    <div>
      {landlord !== null && (
        <div className='w-full flex flex-col'>
          <p className='text-sm text-gray-600'>
            Contact {landlord.name} about the propery
          </p>
          <div className='mt-1'>
            <textarea
              className='w-full rounded px-2 py-1 bg-white text-gray-700 border-3 border-gray-300'
              name='message'
              id='message'
              value={message}
              placeholder='message...'
              rows='2'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button className='w-full mt-2 text-center px-7 py-3 bg-blue-600 rounded text-white text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 transition ease-in-out'>
              Send Message
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
