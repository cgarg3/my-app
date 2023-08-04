import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';
import { NavDropdown } from 'react-bootstrap';
import { searchHistoryAtom } from '@/store';
import { useAtom } from 'jotai';
import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';
// import Button from 'react-bootstrap';

export default function MainNav() {
  const [ searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom)

  const [ isExpanded, setIsExpanded ] = useState(false)

  const [ searchValue, setSearchValue ] = useState("")

  const router = useRouter();

  let token = readToken();

  function logout() {
    setIsExpanded(false)
    removeToken();
    router.push('/');
  }

  async function handleSearch(e)
  {
      e.preventDefault()
      setIsExpanded(false)
      let queryString = `title=true&q=${searchValue}`
      // setSearchHistory(current => [...current, queryString]);
      setSearchHistory(await addToHistory(queryString))
      router.push(`/artwork?${queryString}`)
      // router.push(`/artwork?title=true&q=${searchValue}`)
  }

  function handleChange(e)
  {
      setSearchValue(e.target.value)
  }

  function handleToggle(e)
  {
    // alert("toggle")
    setIsExpanded(!isExpanded)
  }

  return (
    <>
    <Navbar bg="light" expand="lg" className='fixed-top navbar-dark bg-dark' expanded={isExpanded}>
      <Container>
        <Navbar.Brand>Chirag Garg</Navbar.Brand><br />
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" legacyBehavior passHref><Nav.Link onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/"}>Home</Nav.Link></Link>
            {token && (<Link href="/search" legacyBehavior passHref><Nav.Link onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>)}
            {/* <Link href="/search" legacyBehavior passHref><Nav.Link onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link> */}
          </Nav>
          &nbsp;
          {token && (<Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={handleChange}
            />
            <Button variant="success" type='submit' onClick={handleSearch}>Search</Button>
          </Form>)}
          {}
          &nbsp;

          {!token && (<Nav className='ml-auto'>
            <Link href="/register" legacyBehavior passHref><Nav.Link onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/register"}>Register</Nav.Link></Link>
            <Link href="/login" legacyBehavior passHref><Nav.Link onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/login"}>Login</Nav.Link></Link>
          </Nav>)}
          

          {token && (<Nav>
            <NavDropdown title={token.userName} id="basic-nav-dropdown">
              <Link href="/favourites" legacyBehavior passHref><NavDropdown.Item onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
              <Link href="/history" legacyBehavior passHref><NavDropdown.Item onClick={()=>{ setIsExpanded(false) }} active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
              {/* <Link href="/login" legacyBehavior passHref></Link> */}
              <NavDropdown.Item onClick={()=>{ setIsExpanded(false); logout(); }}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>)}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br /><br />
    </>
  );
}