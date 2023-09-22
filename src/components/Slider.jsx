import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
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
import { useNavigate } from 'react-router-dom';

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const qSnap = await getDocs(q);
      let listings = [];
      qSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <div className='cursor-pointer'>
        <Swiper
          slidesPerView={1}
          pagination={{ type: 'progressbar' }}
          navigation
          effect='fade'
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => {
                navigate(`/category/${data.type}/${id}`);
              }}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='relative w-full h-[300px] overflow-hidden'
              ></div>
              <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] px-3 shadow-lg opacity-90 rounded rounded-br-2xl'>
                {data.name}
              </p>
              <div className='text-[#f1faee] absolute left-1 bottom-3 font-medium max-w-[90%] bg-[#e63946] px-3 shadow-lg opacity-90 rounded rounded-tr-2xl'>
                {data.offer ? (
                  <div className='flex space-x-1'>
                    <p className='text-gray-200 line-through'>
                      $
                      {data.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <p>
                      $
                      {data.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      {data.type === 'rent' && ' / month'}
                    </p>
                  </div>
                ) : (
                  <div>
                    $
                    {data.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    {data.type === 'rent' && ' / month'}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
}
