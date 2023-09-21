import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../auth/firebase';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
  // offers
  const [offersListings, setOffersListings] = useState(null);
  const [rentalsListings, setRentalsListings] = useState(null);
  const [salesListings, setSalesListings] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const offersListingsRef = collection(db, 'listings');
        const rentalsListingsRef = collection(db, 'listings');
        const salesListingsRef = collection(db, 'listings');

        const qOffers = query(
          offersListingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        const qRentals = query(
          rentalsListingsRef,
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        const qSales = query(
          salesListingsRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );

        const querySnapOffers = await getDocs(qOffers);
        const querySnapRentals = await getDocs(qRentals);
        const querySnapSales = await getDocs(qSales);

        const offersListings = [];
        const rentalsListings = [];
        const salesListings = [];

        querySnapOffers.forEach((doc) => {
          return offersListings.push({ id: doc.id, data: doc.data() });
        });
        querySnapRentals.forEach((doc) => {
          return rentalsListings.push({ id: doc.id, data: doc.data() });
        });
        querySnapSales.forEach((doc) => {
          return salesListings.push({ id: doc.id, data: doc.data() });
        });

        setOffersListings(offersListings);
        setRentalsListings(rentalsListings);
        setSalesListings(salesListings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className='my-6'>
        <div className='max-w-6xl mx-auto space-y-6'>
          {offersListings && offersListings.length > 0 && (
            <div className=''>
              <h2 className='text-2xl font-semibold mx-1'>Recent Offers</h2>
              <Link to={'/offers'}>
                <button className=' mx-1 text-sm text-blue-600  cursor-pointer hover:text-blue-800 transition ease-in-out'>
                  Show me offers
                </button>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4'>
                {offersListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className='max-w-6xl mx-auto pt-4 space-y-6'>
          {rentalsListings && rentalsListings.length > 0 && (
            <div className=''>
              <h2 className='text-2xl mt-6 font-semibold mx-1'>
                Places for Rent
              </h2>
              <Link to={'/offers'}>
                <button className=' mx-1 text-sm text-blue-600  cursor-pointer hover:text-blue-800 transition ease-in-out'>
                  Show me more rentals
                </button>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4'>
                {rentalsListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className='max-w-6xl mx-auto pt-4 space-y-6'>
          {salesListings && salesListings.length > 0 && (
            <div className=''>
              <h2 className='text-2xl mt-6 font-semibold mx-1'>
                Places for Sale
              </h2>
              <Link to={'/offers'}>
                <button className=' mx-1 text-sm text-blue-600  cursor-pointer hover:text-blue-800 transition ease-in-out'>
                  Show me more places for sale
                </button>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4'>
                {salesListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
