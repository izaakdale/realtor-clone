import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../auth/firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaCouch, FaParking, FaShareAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const [showContactLandlord, setShowContactLandlord] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listings', params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: 'progressbar' }}
        effect='fade'
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className='relative w-full overflow-hidden h-[300px]'
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className='fixed top-[10%] right-[3%] z-50 flex items-center space-x-3'>
        {showLinkCopied && (
          <p className='bg-white text-gray-600 text-sm rounded-xl px-2 py-1 border-gray-300 border-2'>
            Link copied!
          </p>
        )}
        <div className='text-2xl bg-white text-gray-600 rounded-full pl-[4px] pr-[7px] py-[5px] cursor-pointer border-gray-300 border-2'>
          <FaShareAlt
            className=''
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowLinkCopied(true);
              setTimeout(() => {
                setShowLinkCopied(false);
              }, 2000);
            }}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row max-w-6xl m-4 lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5 md:space-x-2'>
        <div className='w-full mb-4 md:mb-0 flex flex-col justify-between'>
          <div className='w-full mr-2'>
            <div className='mb-2 flex-row text-xl font-semibold'>
              <p className='text-gray-800'>{listing.name}</p>
              <div className='flex space-x-1'>
                {listing.offer ? (
                  <div className='flex space-x-2'>
                    <p className='line-through text-gray-300'>
                      $
                      {listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <p className='text-blue-900'>
                      $
                      {listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                  </div>
                ) : (
                  <p className='text-blue-900'>
                    $
                    {listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                )}{' '}
                {listing.type === 'rent' && (
                  <p className='text-blue-900'> / month</p>
                )}
              </div>
            </div>
            <div className='mb-3 flex items-center space-x-2'>
              <FaLocationDot className='text-green-700' />
              <p>{listing.address}</p>
            </div>
            <div className='flex space-x-4 mb-2'>
              <p className='items-center text-xs uppercase bg-red-700 px-3 py-1 text-center rounded shadow-md text-white'>
                {listing.type === 'rent' && 'For rent'}
                {listing.type === 'sale' && 'For sale'}
              </p>
              {listing.offer && (
                <p className='items-center text-xs uppercase bg-green-700 px-3 py-1 text-center rounded shadow-md text-white'>
                  Discounted ${+listing.regularPrice - +listing.discountedPrice}
                </p>
              )}
            </div>
            <div className='flex text-sm text-gray-800 space-x-1'>
              <span className='text-gray-800'>
                <span className='font-semibold'>Description</span> -{' '}
                {listing.description}
              </span>
            </div>

            <div className='flex space-x-3 items-center mt-[10px] mb-4'>
              <div className='flex items-center space-x-1'>
                <FaBed className='text-md' />
                <p className='font-bold text-xs'>
                  {listing.nBeds > 1 ? `${listing.nBeds} beds` : `1 bed`}
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <FaBath className='text-sm' />
                <p className='font-bold text-xs'>
                  {listing.nBaths > 1 ? `${listing.nBaths} baths` : `1 bath`}
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <FaCouch className='text-md' />
                <p className='font-bold text-xs'>
                  {listing.furnished ? '' : 'Not '} Furnished
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <FaParking className='text-xs' />
                <p className='font-bold text-xs'>
                  {listing.parking ? '' : 'No '} Parking
                </p>
              </div>
            </div>
          </div>

          {(!auth.currentUser || listing.userRef !== auth.currentUser.uid) && (
            <div className=''>
              {showContactLandlord ? (
                <Contact listing={listing} />
              ) : (
                <button
                  className='w-full text-center px-7 py-3 bg-blue-600 rounded-lg text-white font-semibold text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 transition ease-in-out'
                  onClick={() => {
                    setShowContactLandlord(!showContactLandlord);
                  }}
                >
                  Contact Landlord
                </button>
              )}
            </div>
          )}
        </div>
        <div className='w-full h-[200px] md:h-[300px] z-10 overflow-x-hidden rounded-lg shadow-md'>
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
