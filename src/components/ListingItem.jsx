import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { FaLocationDot, FaTrash, FaPencil } from 'react-icons/fa6';

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow m-[10px]'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img
          className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
          loading='lazy'
          src={listing.imgUrls[0]}
          alt='oops...'
        />
        <Moment
          className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-[10px]'>
          <div className='flex items-center space-x-1'>
            <FaLocationDot className='h-4 w-4 text-green-600' />
            <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>
              {listing.address}
            </p>
          </div>
          <p className='font-semibold m-0 text-xl text-slate-600 truncate'>
            {listing.name}
          </p>
          <p className='mt-2 font-semibold text-blue-400'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='flex space-x-3 items-center mt-[10px]'>
            <div>
              <p className='font-bold text-xs'>
                {listing.nBeds > 1 ? `${listing.nBeds} beds` : `1 bed`}
              </p>
            </div>
            <div>
              <p className='font-bold text-xs'>
                {listing.nBaths > 1 ? `${listing.nBaths} baths` : `1 bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className='absolute right-2 bottom-2 cursor-pointer text-red-700'
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <FaPencil
          className='absolute right-8 bottom-2 cursor-pointer text-blue-700'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}
