import React from 'react';
import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Error from 'next/error';

export default function ArtworkCard({objectID}) {
    const { data, error, isLoading } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)

    if(error)
    {
        return (<Error statusCode={404} />)
    }
    else if(isLoading)
    {
        return <div>Loading object details...</div>
    }
    else if(data)
    {
        return (
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={data?.primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'} />
            <Card.Body>
                <Card.Title>{data?.title || 'N/A'}</Card.Title>
                <Card.Text>
                    <strong>Date: </strong>{data?.objectDate || 'N/A'} <br />
                    <strong>Classification: </strong>{data?.classification || 'N/A'} <br />
                    <strong>Medium: </strong>{data?.medium || 'N/A'} <br />
                </Card.Text>
                <Link href={`/artwork/${data?.objectID}`} passHref><Button variant="outline-dark"><strong>ID: </strong>{data?.objectID}</Button></Link>
            </Card.Body>
            </Card>
        )
    }
    else
    {
        return null
    }
    
}