import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  function styleMenuButton(route) {
    return `cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
      pathMatchRoute(route) && 'text-gray-950 border-b-red-400'
    }`;
  }

  return (
    <div className='bg-white border-bottom-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto h-12'>
        <div>
          <img
            src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'
            alt='logo'
            className='h-5 cursor-pointer'
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li onClick={() => navigate('/')} className={styleMenuButton('/')}>
              Home
            </li>
            <li
              onClick={() => navigate('/offers')}
              className={styleMenuButton('/offers')}
            >
              Offers
            </li>
            {loggedIn ? (
              <li
                onClick={() => navigate('/profile')}
                className={styleMenuButton('/profile')}
              >
                Profile
              </li>
            ) : (
              <li
                onClick={() => navigate('/sign-in')}
                className={styleMenuButton('/sign-in')}
              >
                Sign-In
              </li>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
}
