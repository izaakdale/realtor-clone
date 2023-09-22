import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../auth/firebase';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

export default function Offers() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(8)
        );

        const snap = await getDocs(q);
        const lastVisible = snap.docs[snap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];
        snap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('unable to fetch listings');
      }
    }
    fetchListings();
  }, []);

  async function onFetchMoreListings() {
    try {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', 'sale'),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(4)
      );

      const snap = await getDocs(q);
      const lastVisible = snap.docs[snap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let listings = [];
      snap.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('unable to fetch listings');
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col space-y-8 my-8'>
      <div className='max-w-6xl mx-auto space-y-6'>
        {listings && listings.length > 0 ? (
          <div className=''>
            <h2 className='text-3xl font-semibold mx-1 text-center'>Sales</h2>
            <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        ) : (
          <>
            <h1>No listings to show</h1>
          </>
        )}
      </div>
      {lastFetchedListing && (
        <div className='flex w-full justify-center'>
          <button
            onClick={() => {
              onFetchMoreListings();
            }}
            className='text-gray-400 hover:text-gray-700 uppercase text-sm border-2 hover:border-red-300 p-2 rounded bg-gray-50 hover:shadow-md transition ease-in-out'
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
