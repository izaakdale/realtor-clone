import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../auth/firebase';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const [editActive, setEditActive] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchUserListings() {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where(
          'userRef',
          '==',
          auth.currentUser.uid,
          orderBy('timestamp', 'desc')
        )
      );

      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);

      console.log(listings);

      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(id) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'listings', id));
      const updatedListings = listings.filter((listing) => listing.id !== id);

      setListings(updatedListings);
      toast.success('listing was deleted!');
    }
  }
  function onEdit(id) {
    navigate(`/edit-listing/${id}`);
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
              className='mt-6 flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition ease-in-out text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:shadow-lg cursor-pointer'
            >
              <FcHome className='mr-2 p-1 text-3xl bg-red-200 rounded-full border-2' />
              Sell or rent your home
            </button>
          </Link>
        </div>
      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>
              My Listings
            </h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6'>
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
