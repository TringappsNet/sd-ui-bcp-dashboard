import React, { useState, useEffect } from 'react';
import ResetNewPassword from './resetNewPassword';
import SendInvite from './sendInvite';
import OrganizationPopup from './OrganizationPopup';
import UserPop from './UserPop';
import '../styles/popup.css';

const PopUpContainer = () => {
  const [roleID, setRoleID] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showOrganizationPopup, setShowOrganizationPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  // Fetch roleID from localStorage when component mounts
  useEffect(() => {
    const storedRoleID = localStorage.getItem('Role_ID');
    setRoleID(storedRoleID);
  }, []);

  const handleResetPopupToggle = () => {
    setShowResetPopup(!showResetPopup);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
  };

  const handleInvitePopupToggle = () => {
    setShowInvitePopup(!showInvitePopup);
    setShowResetPopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
  };

  const handleOrganizationPopupToggle = () => {
    setShowOrganizationPopup(!showOrganizationPopup);
    setShowUserPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
  };

  const handleUserPopupToggle = () => {
    setShowUserPopup(!showUserPopup);
    setShowOrganizationPopup(false);
    setShowResetPopup(false);
    setShowInvitePopup(false);
  };

  const handleClosePopups = () => {
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setShowUserPopup(false);
  };

  const handleResetSuccess = () => {
    setShowResetPopup(false);
  };

  const handleInviteSuccess = () => {
    setShowInvitePopup(false); 
  };

  if (!roleID) {
    return <div>Loading...</div>; // Add loading indicator if roleID is not available yet
  }

  return (
    <div className='text'>
  <div className="dropdown-item-hover border-text" onClick={handleResetPopupToggle}>Reset Password</div>
  {/* <div className="dropdown-item-hover" onClick={handleInvitePopupToggle}>Send Invite</div> */}

  {/* Conditionally render based on roleID */}
  {roleID === '1' && (
    <>
    <div className="dropdown-item-hover" onClick={handleInvitePopupToggle}>Send Invite</div>
      <div className="dropdown-item-hover" onClick={handleOrganizationPopupToggle}>Organization</div>
      <div className="dropdown-item-hover" onClick={handleUserPopupToggle}>User</div>
    </>
  )}

  {/* Render popups based on roleID */}
  {(showResetPopup || showInvitePopup || (showOrganizationPopup && roleID === '1') || (showUserPopup && roleID === '1')) && (
    <div className="popup-container backdrop">
      <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
        {showResetPopup && <ResetNewPassword onClose={handleResetSuccess} />}
        {(showInvitePopup && roleID === '1') && <SendInvite onClose={handleInviteSuccess} />}
        {(showOrganizationPopup && roleID === '1') && <OrganizationPopup className="Organisation" handleClose={handleClosePopups} />}
        {(showUserPopup && roleID === '1') && <UserPop handleClose={handleClosePopups} />}
      </div>
    </div>
  )}
</div>

  );
};

export default PopUpContainer;
