import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai'; // Import the useAtom hook

import { searchHistoryAtom } from '../store'; // Import the searchHistoryAtom
import { addToHistory } from '../lib/userData';


export default function AdvancedSearch() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      searchQuery: "",
      searchBy: "",
      geoLocation: "",
      medium: "",
      isHighlight: false,
      isOnView: false
    }
  });
  const router = useRouter();

  // Get the searchHistory and setSearchHistory from the searchHistoryAtom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // Function takes the form data (ie: the data parameter) and generates a queryString
  const submitForm = async(data) => {
    let queryString = "";
    queryString += `searchBy=${encodeURIComponent(data.searchBy)}`;
    queryString += data.geoLocation ? `&geoLocation=${encodeURIComponent(data.geoLocation)}` : "";
    queryString += data.medium ? `&medium=${encodeURIComponent(data.medium)}` : "";
    queryString += `&isOnView=${data.isOnView || false}`;
    queryString += `&isHighlight=${data.isHighlight || false}`;
    queryString += `&q=${encodeURIComponent(data.searchQuery)}`;

    console.log(`/artwork?${queryString}`);
    router.push(`/artwork?${queryString}`);
    reset();

    try {
        // Add the computed queryString to the searchHistory in the database
        setSearchHistory(await addToHistory(queryString));
      } catch (error) {
        console.error('Error adding to history:', error);
      }
  };


return (
  <div className="mt-5">
      <Form onSubmit={handleSubmit(submitForm)}>
          <Row>
              <Col>
              <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Search Query</Form.Label>
                  <Form.Control type="text" placeholder="" name="q" {...register("searchQuery", { required: true })} />
                  {errors.searchQuery?.type === 'required' && <span className="is-invalid">This field is required.</span>}
              </Form.Group>
              </Col>
          </Row>
          <Row>
              <Col md={4}>
              <Form.Label className='form-label'>Search By</Form.Label>
              <Form.Select name="searchBy" className="mb-3" {...register("searchBy")} >
                  <option value="title">Title</option>
                  <option value="tags">Tags</option>
                  <option value="artistOrCulture">Artist or Culture</option>
              </Form.Select>
              </Col>
              <Col md={4}>
              <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Geo Location</Form.Label>
                  <Form.Control type="text" placeholder="" name="geoLocation" {...register("geoLocation")} />
                  <Form.Text className="form-label-muted">
                  Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
              </Form.Text>
              </Form.Group>
              </Col>
              <Col md={4}>
              <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Medium</Form.Label>
                  <Form.Control type="text" placeholder="" name="medium" {...register("medium")}/>
                  <Form.Text className="form-label-muted">
                  Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
              </Form.Text>
              </Form.Group>
              </Col>
          </Row>
          <Row>
              <Col>
              <Form.Check
                  className='form-label'
                  type="checkbox"
                  label="Highlighted"
                  name="isHighlight"
                  {...register("isHighlight")}
              />
              <Form.Check
                  className='form-label'
                  type="checkbox"
                  label="Currently on View"
                  name="isOnView"
                  {...register("isOnView")}
              />
              </Col>
          </Row>
          <Row>
              <Col>
              <br />
              <Button variant="dark" type="submit">
                  Submit
              </Button>
              </Col>
          </Row>
      </Form>
  </div>
);
} 