
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
// import { Error } from '../components/Error'; // Import the Error component
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { addToFavourites, removeFromFavourites } from '../lib/userData'; // Import functions to handle favorites


const useFavouritesAtom = () => {
  return useAtom(favouritesAtom);
};

const ArtworkCardDetail = ({ objectID }) => {
  const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  };

  // Get the favouritesList and setFavouritesList from the favouritesAtom
  const [favouritesList, setFavouritesList] = useFavouritesAtom();

  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null,
    fetcher
  );

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const { primaryImage, title, objectDate, classification, medium, artistDisplayName, creditLine, dimensions, artistWikidata_URL } = data;

  const cardImgSrc = primaryImage ? primaryImage : 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]';

  // Get a reference to the "showAdded" value in the state
  const [showAdded, setShowAdded] = useState(favouritesList.includes(objectID));

  // Function to handle the favourites button click
  const favouritesClicked = async () => {
    if (showAdded) {
      // Remove the objectID from the "favouritesList"
      setFavouritesList((current) => current.filter((fav) => fav !== objectID));
      // Remove the objectID from the user's favorites on the server
      await removeFromFavourites(objectID);
    } else {
      // Add the objectID to the "favouritesList"
      setFavouritesList((current) => [...current, objectID]);
      // Add the objectID to the user's favorites on the server
      await addToFavourites(objectID);
    }
    // Toggle the "showAdded" state
    setShowAdded(!showAdded);
  };

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={cardImgSrc} />}
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <div>
          Object Date: {objectDate || 'N/A'}
          <br />
          Classification: {classification || 'N/A'}
          <br />
          Medium: {medium || 'N/A'}
          <br />
          <br />
          Artist: {artistDisplayName || 'N/A'}
          {artistDisplayName && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}
          <br />
          Credit Line: {creditLine || 'N/A'}
          <br />
          Dimensions: {dimensions || 'N/A'}
        </div>

        {/* Favourites Button */}
        <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>
          {showAdded ? '+ Favourite (added)' : '+ Favourite'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;


