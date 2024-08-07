import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Guide.css';

const Guide = ({ onClose }) => {
    const roleId = localStorage.getItem('Role_ID');
    const superuserRef = useRef(null);
    const restrictedRef = useRef(null);

    const scrollToSuperuser = () => {
        if (superuserRef.current) {
            superuserRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToRestrictedUser = () => {
        if (restrictedRef.current) {
            restrictedRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="form d-flex justify-content-center align-items-center">
            <Container className="guide shadow bg-body">
                <span className="close-guide" onClick={onClose}>✖</span>
                <div className="header-buttons">
                    {roleId === '1' && (
                        <>
                            <button className="guide-button" onClick={scrollToSuperuser}>SUPERUSER</button>
                            <button className="guide-button" onClick={scrollToRestrictedUser}>RESTRICTEDUSER</button>
                        </>
                    )}
                </div>
                <h3 className="mb-4 mt-1">Application Guide</h3>
                
                
                <div className="guide-content">
                   {roleId === '1' &&
                    <div className="guide-section-1">
                        <h4>ADMIN</h4>
                        <br />
                        <h5>1. Getting Started</h5>
                        <br />
                        <h6>This application enables you to upload and submit the Excel files for efficient management of data.</h6>
                        <img src="/images/dashboard.png" alt="Getting Started" className="img-fluid" />
                
                        <h5>2. Features Overview</h5>
                        <br />
                        <h6>This application offers a variety of features tailored to different user roles:</h6>
                        <ul>
                            <li><strong>Admin:</strong> Access to all features</li>
                            <ul>
                                <li>Reset Password</li>
                                <li>Send Invite</li>
                                <li>Portfolio Companies</li>
                                <li>Users</li>
                                <li>Audit History</li>
                                <li>Logout</li>
                            </ul>
                            <img src="/images/Admin.png" alt="Features Overview" className="img-fluid" />
                            
                        </ul>      
                    
                        <h5>3. How to Use</h5>
                        <br />
                        <ul>
                        <li><h6>When you upload a file containing values that match existing data, 
                            you will be prompted with an option to either override the existing data or cancel the operation.</h6></li>
                       <img src="/images/override.png" alt="How to Use" className="img-fluid" />    
                       <li><h6> After uploading the Excel data, you can update using the edit icon if any changes are needed.</h6></li>
                        <img src="/images/Update.png" alt="How to Use" className="img-fluid" />
                        <li><h6> After uploading the Excel data, you can delete the data using the delete icon.</h6></li>
                        <img src="/images/delete.png" alt="How to Use" className="img-fluid" />
                        </ul>
                        
                        <h5>4. Admin Features</h5>
                        <br />
                        <ul>
                        <li><h6> This panel offers a feature to change the passwords using their existing credentials. </h6></li>
                        <img src="/images/reset_pass.png" alt="Admin Featuers" className="img-fluid" /> 
                        <li><h6> You can leverage the "Send Invite" function to invite new users, specifying the roles 
                        and  the company affiliation during the invitation process. </h6>  </li>
                        <img src="/images/send_invite.png" alt="Admin Featuers" className="img-fluid" />   
                        <li><h6> This panel provides a comprehensive portfolio management section. Here, you can view the list of existing 
                        companies, add the new ones, edit the company details and delete the companies.</h6></li>
                        <img src="/images/portfolio.png" alt="Admin Featuers" className="img-fluid" /> 
                        <li><h6> This management section offers you an overview of all users. you can edit  the user roles,
                        deactivate accounts, and access a complete list of registered users. </h6> </li>
                        <img src="/images/user_edit.png" alt="Admin Featuers" className="img-fluid" /> 
                        <img src="/images/user_delete.png" alt="Admin Featuers" className="img-fluid" /> 
                        <li><h6> Audit History tracks and displays a comprehensive log of user activities related to file management, including file uploads and updates. 
                            This feature provides a transparent record of actions performed by users, showing who uploaded files and made modifications to them over time. </h6></li>
                        <img src="/images/Audit.png" alt="Admin Featuers" className="img-fluid" /> 
                        <li><h6> A secure logout option allows admins to safely exit the application. </h6></li>
                        <img src="/images/logout.png" alt="Admin Featuers" className="img-fluid" /> 
                        </ul>
                    
                    </div>}

                     
                    {(roleId === '2' || roleId === '1') && 
                    <div className="guide-section-2" ref={superuserRef}>
                          {roleId === '1' &&
                    <h4>SUPERUSER</h4>}
                        <br />
                        <h5>1. Getting Started</h5>
                        <br />
                        <h6>This application enables you to upload and submit the Excel files for efficient management of data.</h6>
                        <img src="/images/dashboard.png" alt="Getting Started" className="img-fluid" />
                        <h5>2. Features Overview</h5>
                        <br />
                            <ul>
                                <li>Reset Password</li>
                                <li>Logout</li>
                            </ul>    
                        <img src="/images/superuser.png" alt="Features Overview" className="img-fluid" />
                        
                        <ul> <li><h6>When you upload a file containing values that match existing data, 
                        you will be prompted with an option to either override the existing data or cancel the operation.</h6></li>
                        <img src="/images/Superuser_override.png" alt="How to Use" className="img-fluid" /></ul>
                        <li><h6> After uploading the Excel data, you can update using the edit icon if any changes are needed.</h6></li>
                        <img src="/images/superuser_update.png" alt="How to Use" className="img-fluid" />
                        <li><h6> After uploading the Excel data, you can delete the data using the delete icon.</h6></li>
                        <img src="/images/superuser_delete.png" alt="How to Use" className="img-fluid" />
                       
                        <h5>3. How to Use</h5>
                        <br />
                        <ul>
                            <li><h6>You can reset the password using the existing credentials. </h6></li>
                        <img src="/images/Superuser_reset.png" alt="Features Overview" className="img-fluid" />
                            <br /> 
                            <li><h6> A secure logout option allows superuser to safely exit the application.</h6></li>
                        <img src="/images/Superuser_logout.png" alt="Features Overview" className="img-fluid" />
                        </ul>   

                    </div> }
                 
                    {(roleId === '3' || roleId === '1') &&                 
                    <div className="guide-section-3" ref={restrictedRef}>
                         {roleId === '1' &&
                    <h4>RESTRICTED USER</h4>}
                        <br />
                        <h5>1. Getting Started</h5>
                        <br />
                        <ul>
                            <h6>This application enables you to only view the Excel files.</h6>
                            <img src="/images/restricted.png" alt="Features Overview" className="img-fluid" />
                            <h5>2. Features Overview</h5>
                            <br />
                            <ul>
                                <li>Reset Password</li>
                                <li>Logout</li>
                            </ul>
                            <br />
                            <li><h6> You can reset the password using the existing credentials. </h6></li>
                            <img src="/images/restricted_reset.png" alt="Features Overview" className="img-fluid" />
                            <li><h6> A secure logout option allows superuser to safely exit the application.</h6></li>
                            <img src="/images/restricted_logout.png" alt="Features Overview" className="img-fluid" />   
                        </ul>         
                    </div>}

                </div>
            </Container>
        </div>
    );
}

export default Guide;