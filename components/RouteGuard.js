// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAtom } from 'jotai'; // Import the useAtom hook
// import { isAuthenticated, readToken } from '../lib/authenticate';
// import { favouritesAtom, searchHistoryAtom } from '../store'; // Import the atoms
// import { getFavourites, getHistory } from '../lib/userData'; // Import the userData functions

// const PUBLIC_PATHS = ['/login', '/register','/','/_error']; // Add '/register' to the PUBLIC_PATHS array

// const RouteGuard = ({ children }) => {
//   const router = useRouter();

//   // Get the favourites and searchHistory atoms
//   const [favourites, setFavourites] = useAtom(favouritesAtom);
//   const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

//   // Function to update the atoms with user data
//   const updateAtoms = async () => {
//     try {
//       // Get the favourites and history for the current user
//       const { favourites: userFavourites, searchHistory: userSearchHistory } = await getUserData();

//       // Update the atoms with the user data
//       setFavourites(userFavourites);
//       setSearchHistory(userSearchHistory);
//     } catch (error) {
//       console.error('Error updating atoms:', error);
//     }
//   };

//   // Check if the user is authenticated when the component is mounted
//   useEffect(() => {
//     if (!isAuthenticated() && !PUBLIC_PATHS.includes(router.pathname)) {
//       // Redirect to login page if the user is not authenticated and trying to access secure pages
//       router.replace('/login');
//     } else {
//       // Update the atoms with user data if the user is authenticated
//       updateAtoms();
//     }
//   }, [router]);

//   // Render the children components if the user is authenticated
//   return isAuthenticated() ? <>{children}</> : null;
// };

// export default RouteGuard;



import React from "react";
import { useState, useEffect } from 'react';
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { getFavourites, getHistory } from "@/lib/userData";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ['/register', '/login', '/', '/_error'];

export default function RouteGuard(props) {
    // References to atoms
    const [ favouritesList, setFavouritesList ] = useAtom(favouritesAtom);
    const [ searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom);
    // Authorization State
    const [authorized, setAuthorized] = useState(false);
    // Router instance
    const router = useRouter();

    // Function to update the atoms in our store before redirecting the user
    async function updateAtoms() {
      // try catch
      try {
        let data = await getFavourites();
        setFavouritesList(data);
        data = await getHistory();
        setSearchHistory(data);
      } catch (error) {
        console.error('Error updating atoms:', error);
      }
  
    } 

    // Run auth check on initial load
    useEffect(() => {
      // check if logged in
      authCheck(router.pathname);
      // on route change complete - run auth check
      router.events.on('routeChangeComplete', authCheck);
      if (isAuthenticated())
        updateAtoms();
      // unsubscribe from events in useEffect return function
      return () => {
        router.events.off('routeChangeComplete', authCheck);
      };
    }, []);

    // Redirect to login page if accessing a private page and not logged in
    function authCheck(url) {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
          setAuthorized(false);
          router.push('/login');
        } else {
          setAuthorized(true);
        }
      }

    return <>{props.children}</>
}