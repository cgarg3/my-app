import React from 'react';
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import Error from 'next/error';

export default function ArtworkCardDetail({objectID}) {
    // alert(objectID)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    // const showAdded = favouritesList.includes(objectID);
    // alert(favouritesList.length)
    const [ showAddedState, setShowAddedState ] = useState(false)
    
    useEffect(()=>{
        setShowAddedState(favouritesList?.includes(objectID))
    }, [favouritesList, objectID])
    
    // function check()
    // {
    //     alert(favouritesList)
    // }

    async function favouritesClicked()
    {
        if(showAddedState)
        {
            setFavouritesList(await removeFromFavourites(objectID))
            // setFavouritesList(current => current.filter(fav => fav != objectID));
            setShowAddedState(false)
        }
        else
        {
            setFavouritesList(await addToFavourites(objectID))
            setShowAddedState(true)
        }
        // setShowAddedState(!showAddedState);
    }

    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null)

    if(error)
    {
        return <Error statusCode={404} />;
    }
    else if(data)
    {
        return (
            <Card>
            {data?.primaryImage && <Card.Img variant="top" src={data?.primaryImage || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'} />}
            <Card.Body>
                <Card.Title>{data?.title || 'N/A'}</Card.Title>
                <Card.Text>
                    <strong>Date: </strong>{data?.objectDate || 'N/A'} <br />
                    <strong>Classification: </strong>{data?.classification || 'N/A'} <br />
                    <strong>Medium: </strong>{data?.medium || 'N/A'} <br /><br />

                    <strong>Artist: </strong>{data?.artistDisplayName ? data?.artistDisplayName : "N/A"}
                    {data?.artistDisplayName && <span> ( <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer" style={{color: "red"}}>wiki</a> )</span>} <br />
                    
                    <strong>Credit Line: </strong>{data?.creditLine || 'N/A'} <br />
                    <strong>Dimensions: </strong>{data?.dimensions || 'N/A'}
                </Card.Text>
                {/* <Link href={`/artwork/${objectID}`} passHref><Button variant="outline-primary"></Button></Link> */}
                <Button variant={showAddedState ? "primary" : "outline-primary"} onClick={favouritesClicked}>+ Favourite{showAddedState ? ' (added)' : ''}</Button>
                {/* <Button onClick={check}>Check</Button> */}
            </Card.Body>
            </Card>
        )
    }
    else
    {
        return null
    }
    
}