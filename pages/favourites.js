import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';

const Favourites = () => {
  // Get the favouritesList from the favouritesAtom
  const [favouritesList] = useAtom(favouritesAtom);

  // If favouritesList is not available yet (still loading from the server), return null
  if (!favouritesList) return null;

  return (
    <>
      <h1>Favourites</h1>
      {favouritesList.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try adding some new artwork to the list.
          </Card.Body>
        </Card>
      ) : (
        <Row className="gy-4">
          {favouritesList.map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Favourites;
