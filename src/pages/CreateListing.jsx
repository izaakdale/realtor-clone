import React, { useState } from 'react';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    nBeds: 0,
    nBaths: 0,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
  });
  const {
    type,
    name,
    nBeds,
    nBaths,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
  } = formData;
  function onChange() {}

  return (
    <div>
      <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>
          Create a listing
        </h1>
        <form>
          <p className='text-lg mt-6 font-semibold'>Sell/Rent</p>
          <div className='flex justify-between'>
            <button
              type='button'
              id='type'
              value='sale'
              onClick={onChange}
              className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                type === 'sale'
                  ? 'bg-slate-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              sell
            </button>
            <button
              type='button'
              id='type'
              value='sale'
              onClick={onChange}
              className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                type === 'rent'
                  ? 'bg-slate-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              rent
            </button>
          </div>

          <p className='text-lg mt-6 font-semibold'>Name</p>
          <input
            type='text'
            id='name'
            value={name}
            onChange={onChange}
            placeholder='Name'
            maxLength='32'
            minLength='10'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
          />

          <div className='flex space-x-6 mb-6'>
            <div>
              <p className='text-lg font-semibold'>Beds</p>
              <input
                type='number'
                id='nBeds'
                value={nBeds}
                onChange={onChange}
                min={1}
                max={50}
                required
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
              />
            </div>
            <div>
              <p className='text-lg font-semibold'>Baths</p>
              <input
                type='number'
                id='nBaths'
                value={nBaths}
                onChange={onChange}
                min={1}
                max={50}
                required
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
              />
            </div>
          </div>

          <p className='text-lg mt-6 font-semibold'>Parking</p>
          <div className='flex justify-between'>
            <button
              type='button'
              id='type'
              value={parking}
              onClick={onChange}
              className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                parking ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              yes
            </button>
            <button
              type='button'
              id='type'
              value={parking}
              onClick={onChange}
              className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                !parking ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              no
            </button>
          </div>

          <p className='text-lg mt-6 font-semibold'>Furnished</p>
          <div className='flex justify-between'>
            <button
              type='button'
              id='furnished'
              value={furnished}
              onClick={onChange}
              className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                furnished ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              yes
            </button>
            <button
              type='button'
              id='furnished'
              value={furnished}
              onClick={onChange}
              className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                !furnished ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              No
            </button>
          </div>

          <p className='text-lg mt-6 font-semibold'>Address</p>
          <textarea
            type='text'
            id='address'
            value={address}
            onChange={onChange}
            placeholder='Address'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
          />

          <p className='text-lg font-semibold'>Description</p>
          <textarea
            type='text'
            id='description'
            value={description}
            onChange={onChange}
            placeholder='Description'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
          />

          <p className='text-lg font-semibold'>Offer</p>
          <div className='flex justify-between mb-6'>
            <button
              type='button'
              id='offer'
              value={offer}
              onClick={onChange}
              className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                offer ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              yes
            </button>
            <button
              type='button'
              id='offer'
              value={offer}
              onClick={onChange}
              className={`px-7 py-3 ml-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                !offer ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              No
            </button>
          </div>

          <div className=''>
            <p className='text-lg font-semibold'>Regular Price</p>
            <div className='w-full mb-6'>
              <input
                type='number'
                id='regularPrice'
                value={regularPrice}
                onChange={onChange}
                required
                className='text-gray-700 border-gray-300 rounded focus:bg-white focus:border-slate-600 text-center'
              />
              <span className='ml-4 '>$</span>
              {type === 'rent' && <span> / Month</span>}
            </div>
          </div>

          {offer && (
            <div className=''>
              <p className='text-lg font-semibold'>Discounted Price</p>
              <div className='w-full mb-6'>
                <input
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onChange}
                  required
                  className='text-gray-700 border-gray-300 rounded focus:bg-white focus:border-slate-600 text-center'
                />
                <span className='ml-4 '>$</span>
                {type === 'rent' && <span> / Month</span>}
              </div>
            </div>
          )}

          <div className='mb-6'>
            <p className='text-lg font-semibold'>Images</p>
            <p className='text-sm text-gray-500'>
              The first image will be the cover, max 6 images
            </p>
            <input
              type='file'
              id='images'
              onChange={onChange}
              accept='.jpg,.png,.jpeg'
              multiple
              required
              className='w-full bg-white px-3 py-1.5 text-gray-700 border-gray-300 rounded transition ease-in-out focus:bg-white focus:border-slate-600'
            />
          </div>
          <button
            type='submit'
            className='mb-6 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded text-sm uppercase shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 hover:shadow-lg transition ease-in-out'
          >
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}
