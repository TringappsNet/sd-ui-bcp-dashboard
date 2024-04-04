// Navbar.js

import React from 'react';
import { Navbar, Nav, Dropdown, FormControl, Button,  NavbarToggle,
    NavbarCollapse, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PopUpContainer from "./popup";
import "../styles/NavBar.css";
const NavbarComponent = ({ username, handleLogout, isMobile }) => {
  return (
    <Navbar bg="light" expand="lg" className="w-100">
    <a href="/dashboard" className="brand-wrapper">
      <Link to="/dashboard" className="customNavbarBrand"></Link>
    </a>
    <NavbarToggle aria-controls="" />
    <NavbarCollapse id="">
      <Nav className="ml-auto ">
        {isMobile ? (
          <Dropdown className=''>
            <Dropdown.Toggle
              id="dropdown-basic"
              as="div"
              className="customDropdown"
            >
              <div className="username-container">
                {username}
                <FontAwesomeIcon className="username" icon={faUser} />
              </div>
            </Dropdown.Toggle>
  
            <Dropdown.Menu  className='Menu'>
              <PopUpContainer></PopUpContainer>
              <div onClick={handleLogout}>Logout</div>
            </Dropdown.Menu>
          </Dropdown>


        ) : (
          <React.Fragment>
            <div className="smallscreen">
              <div className="ml-auto align-items-center user ">
                <FontAwesomeIcon icon={faUser} /> {username}
              </div>
              <PopUpContainer>
              </PopUpContainer>
              <Dropdown.Item onClick={handleLogout} className="logout">
                Logout
              </Dropdown.Item>
            </div>
          </React.Fragment>
        )}
      </Nav>
    </NavbarCollapse>
  </Navbar>
  
  );
};

export default NavbarComponent;
