import Auth from '../../utils/auth';
import React from 'react'
import {
  Alert,
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import './Dashboard.css';

export default function DashboardComponent() {

  function logoutHandler () {
    Auth.logout();
  }

  return (
    
    <Navbar className='navColor' variant='light' expand="lg">
      <Container>
        
        <Navbar.Brand href="#home" className='brand'>S i Z Z L i N .</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className='link'>Home</Nav.Link>
            {!Auth.loggedIn() ? 
            <Nav.Link href="/login" className='link'>Login</Nav.Link>:
            <Button onClick={logoutHandler} className='link'>Logout</Button>}
            <NavDropdown className='link' title="Dropdown" id="basic-nav-dropdown">
              {/* <Button onClick={}>Logout</Button> */}
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
