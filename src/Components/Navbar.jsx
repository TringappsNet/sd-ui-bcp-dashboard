
import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PopUpContainer from "./popup";
import "../styles/NavBar.css";

const NavbarComponent = ({ handleLogout, isMobile }) => {
  const firstName = localStorage.getItem('firstName')
  const lastName = localStorage.getItem('lastName');
  const role = localStorage.getItem('role');
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Navbar bg="light" expand="lg" className="navigation w-100 navbar-dark">
      <Link to="/dashboard" className="brand-wrapper">
        <div className="customNavbarBrand"></div>
      </Link>
      <Navbar.Toggle aria-controls="" className=''/>
      <Navbar.Collapse id="">
        <Nav className="ml-auto">
          {isMobile ? (
            <Dropdown className='text-light'>
              <Dropdown.Toggle
                id="dropdown-basic"
                as="div"
                className="customDropdown"
              >
                <div className='access-container'>
                  <div className="username-container">
                    {fullName}
                  </div>
                  {role !== 'Restricted-User' && (
                    <div className="role-container">
                      ({role})
                    </div>
                  )}
                </div>
                <FontAwesomeIcon className="username text-light" icon={faUser} />
              </Dropdown.Toggle>

              <Dropdown.Menu className='Menu'>
                <PopUpContainer></PopUpContainer>
                <div className="dropdown-item-hover text" onClick={handleLogout}>Logout</div>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <React.Fragment>
              <div className="smallscreen">
                <div className="ml-auto user">
                  <FontAwesomeIcon className='icon' icon={faUser} />{fullName} 
                </div>
                
                {role !== 'Restricted-User' && (
                  <div className="ml-auto role">
                    ({role})
                  </div>
                )}
                <PopUpContainer />
                <Dropdown.Item onClick={handleLogout} className="logout text">
                  Logout
                </Dropdown.Item>
              </div>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
