import React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import Error from 'next/error'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import ArtworkCard from '@/components/ArtworkCard'
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12

export default function Index() {
    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`)

    const [page, setPage] = useState(1)
    const [artworkList, setArtworkList] = useState([])

    function previousPage()
    {
        if(page > 1)
        {
            setPage(prevPage => prevPage - 1)
        }
    }

    function nextPage()
    {
        if(page < artworkList.length)
        {
            setPage(prevPage => prevPage + 1)
        }
    }

    useEffect(() => {
        if(data)
        {
            let results = []
            // for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE)
            // {
                //     const chunk = data?.objectIDs.slice(i, i + PER_PAGE);
                //     results.push(chunk);
            // }
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
            
            setArtworkList(results);
        }
        setPage(1)
    }, [data])

    if(error)
    {
        return <Error statusCode={404} />
    }

    return (
        <div className='container'>
            {artworkList ? (
                <>
                    <Row className="gy-4">
                        {artworkList?.length > 0 ? (
                           Array.isArray(artworkList[page - 1]) ? artworkList[page - 1]?.map((currentObjectID) => (
                                <Col lg={3} key={currentObjectID}>
                                    <ArtworkCard objectID={currentObjectID} />
                                </Col>
                            ))
                         : null) : (
                            <Card>
                                <Card.Body>
                                    <h4>Nothing Here</h4>
                                    Try searching for something else.
                                </Card.Body>
                            </Card>
                        )}
                    </Row><br /><br />
                    {artworkList?.length > 0 && (
                        <Row>
                            <Col>
                                <Pagination>
                                    <Pagination.Prev onClick={previousPage}></Pagination.Prev>
                                    <Pagination.Item active>{page}</Pagination.Item>
                                    <Pagination.Next onClick={nextPage}></Pagination.Next>
                                </Pagination>
                            </Col>
                        </Row>
                    )}
                </>
            ) : null}
        </div>
    )
}