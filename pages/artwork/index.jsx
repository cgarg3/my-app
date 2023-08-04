import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Col, Pagination, Row, Card } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import Error from 'next/error';
import useSWR from 'swr';
import validObjectIDList from '@/public/data/validObjectIDList.json';

const PER_PAGE = 12;

const Artwork = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const fetchData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  };

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetchData
  );

  const previousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [finalQuery]);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const filteredResults = validObjectIDList.objectIDs.filter((x) =>
    data.objectIDs?.includes(x)
  );

  const artworkList = [];
  for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
    const chunk = filteredResults.slice(i, i + PER_PAGE);
    artworkList.push(chunk);
  }

  return (
    <>
      {artworkList.length > 0 ? (
        <Row className="gy-4">
          {artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
          </Card.Body>
        </Card>
      )}
      {artworkList.length > 0 && (
        <Row className="mt-4 justify-content-center">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} disabled={page === 1} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next
                onClick={nextPage}
                disabled={page === artworkList.length}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Artwork;
      