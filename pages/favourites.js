import React from "react";
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '@/components/ArtworkCard';

export default function Favourites() {
    // Get a reference to the favourites list
    const [ favourites, setFavourites ] = useAtom(favouritesAtom);
    if(!favourites) return null;

    // Add the artworkList to the state
    let [ artworkList, setArtworkList ] = useState([]);
      
    // Create a 2D array of data for paging that is set in the state 
    useEffect(() => {
            setArtworkList(favourites);
    }, []);

    return (
        <>
            <Container>
            {artworkList.length > 0 ? (
                <>
                    <Row className="gy-4">
                        {artworkList.map((currentObjectID) => (
                            <Col lg={3} key={currentObjectID}>
                                <ArtworkCard objectID={currentObjectID} />
                            </Col>
                        ))}
                    </Row>
                </>
                ) : (
                <Card>
                    <Card.Body>
                    <h4>Nothing Here</h4>
                    <p>Try searching for something else.</p>
                    </Card.Body>
                </Card>
                )}
            </Container>
        </>
    );
}