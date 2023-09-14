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
import { FaShareAlt } from 'react-icons/fa';

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLinkCopied, setShowLinkCopied] = useState(false);
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
    </main>
  );
}
