import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown'; // Add this import statement
import { useRouter } from 'next/router';
import { useAtom } from 'jotai'; // Import the useAtom hook

import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData';
import { removeToken, readToken } from '../lib/authenticate';




export default function MainNav() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Get the searchHistory and setSearchHistory from the searchHistoryAtom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = async(event) => {
    event.preventDefault();
    setIsExpanded(false); // Close the navbar when form is submitted
    const queryString = `/artwork?title=true&q=${searchText}`;
    // Store the queryString as an object
    const searchEntry = {
      title: true,
      q: searchText,
    };
    router.push(queryString);
    try {
      // Add the computed queryString to the searchHistory in the database
      setSearchHistory(await addToHistory(`title=true&q=${searchText}`));
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded); // Toggle the isExpanded state when the Navbar.Toggle is clicked
  };

  const handleNavLinkClick = () => {
    setIsExpanded(false); // Close the navbar when a Nav.Link is clicked
  };

  const logout = () => {
    setIsExpanded(false); // Close the navbar when logging out
    removeToken(); // Remove the token from localStorage
    router.push('/login'); // Redirect the user to the login page
  };

  const token = readToken();
  console.log('Current path:', router.pathname);

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-dark" expanded={isExpanded}>
        <Container>
          <Navbar.Brand className="text-light">Chirag Garg</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleNavbarToggle} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} className="text-light" onClick={handleNavLinkClick}>Home</Nav.Link></Link>
              {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} className="text-success" onClick={handleNavLinkClick}>Advanced Search</Nav.Link></Link>}
            </Nav>

            {/*  controlled Component */}
            {token && (
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={(e) => setSearchText(e.target.value)} />
                <Button type='submit' variant="outline-success" className="btn btn-success text-light" >Search</Button>
              </Form>
            )}

            {/* User Name Dropdown */}
            {token ? (
              <Nav>
                <NavDropdown title={token.userName} id="user-name-dropdown">
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item onClick={handleNavLinkClick} active={router.pathname === "/favourites"} >Favourites</NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item onClick={handleNavLinkClick} active={router.pathname === "/history"} >Search History</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} className="text-light" onClick={() => setIsExpanded(false)}>Register</Nav.Link></Link>
                <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} className="text-light" onClick={() => setIsExpanded(false)}>Login</Nav.Link></Link>
              </Nav>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br />
    </>
  );
}

