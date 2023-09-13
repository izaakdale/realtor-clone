import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../auth/firebase';
import { useNavigate, useParams } from 'react-router';

export default function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();

  const geoLocationEnabled = true;
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
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
    latitude: 0,
    longitude: 0,
    images: [],
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
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('insufficient priviledges to edit this listing');
      navigate('/');
    }
  }, [listing, auth, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing(id) {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('listing does not exist');
      }
    }
    fetchListing(params.id);
  }, [params, navigate]);

  function onChange(e) {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (+regularPrice <= +discountedPrice) {
      setLoading(false);
      toast.error('Discounted price must be lower than regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Only 6 images are allowed to be uploaded');
      return;
    }

    let geolocation = {};
    let location;
    let formattedAddress;
    if (geoLocationEnabled) {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await resp.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      formattedAddress = data.results[0]?.formatted_address;

      location = data.status === 'ZERO_RESULTS' && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error('please enter a valid address');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);

        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                console.log('Upload should not reach here!');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error('images failed to upload');
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    formDataCopy.address = formattedAddress;

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    const docRef = doc(db, 'listings', params.id);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success('successfully edited the listing');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Edit listing</h1>
        <form onSubmit={onSubmit}>
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
              value='rent'
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
              id='parking'
              value={true}
              onClick={onChange}
              className={`px-7 py-3 mr-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${
                parking ? 'bg-slate-600 text-white' : 'bg-white text-black'
              }`}
            >
              yes
            </button>
            <button
              type='button'
              id='parking'
              value={false}
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
              value={true}
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
              value={false}
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

          {!geoLocationEnabled && (
            <div className='flex space-x-6 mb-6'>
              <div>
                <p className='text-lg font-semibold'>Latitude</p>
                <input
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onChange}
                  required
                  min={-90}
                  max={90}
                  className='text-gray-700 border-gray-300 rounded focus:bg-white focus:border-slate-600 text-center'
                />
              </div>
              <div>
                <p className='text-lg font-semibold'>Longitude</p>
                <input
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onChange}
                  required
                  min={-180}
                  max={180}
                  className='text-gray-700 border-gray-300 rounded focus:bg-white focus:border-slate-600 text-center'
                />
              </div>
            </div>
          )}

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
              value={true}
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
              value={false}
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
                min={50}
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
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
}
