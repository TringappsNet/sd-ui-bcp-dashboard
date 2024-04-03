import React, { useState } from 'react';
import ResetNewPassword from './resetNewPassword';
import SendInvite from './sendInvite';
import OrganizationPopup from './OrganizationPopup';
import UserPop from './UserPop';
import '../styles/popup.css';

const PopUpContainer = () => {
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showOrganizationPopup, setShowOrganizationPopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [timerID, setTimerID] = useState(null);

  const handleResetPopupToggle = () => {
    setShowResetPopup(!showResetPopup);
    setShowInvitePopup(false); // Close invite popup
    setShowOrganizationPopup(false); // Close organization popup
    setShowAdminPopup(false); // Close admin popup
  };

  const handleInvitePopupToggle = () => {
    setShowInvitePopup(!showInvitePopup);
    setShowResetPopup(false); // Close reset password popup
    setShowOrganizationPopup(false); // Close organization popup
    setShowAdminPopup(false); // Close admin popup
  };

  const handleOrganizationPopupToggle = () => {
    setShowOrganizationPopup(!showOrganizationPopup);
    setShowAdminPopup(false); // Close admin popup
    setShowResetPopup(false); // Close reset password popup
    setShowInvitePopup(false); // Close invite popup
  };

  const handleAdminPopupToggle = () => {
    setShowAdminPopup(!showAdminPopup);
    setShowOrganizationPopup(false); // Close organization popup
    setShowResetPopup(false); // Close reset password popup
    setShowInvitePopup(false); // Close invite popup
  };

  const handleClosePopups = () => {
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setShowAdminPopup(false);
    
  };

  const handleResetSuccess = () => {
    setShowResetPopup(false);
  };

  const handleInviteSuccess = () => {
    setShowInvitePopup(false); 
  };

  return (
    <div>
      <button onClick={handleResetPopupToggle} className='reset'> Reset Password</button>
      <button onClick={handleInvitePopupToggle} className='invite'> Send Invite</button>
      <button onClick={handleOrganizationPopupToggle} className='organization'>Organization</button>
      <button onClick={handleAdminPopupToggle} className='admin'>User</button>

      {(showResetPopup || showInvitePopup || showOrganizationPopup || showAdminPopup) && (
        <div className="popup-container">

          <div className="backdrop" ><span className="cancel-symbol " onClick={handleClosePopups}>✖</span>
</div>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            {showResetPopup && <ResetNewPassword onClose={handleResetSuccess} />}
            {showInvitePopup && <SendInvite onClose={handleInviteSuccess} />}
            {showOrganizationPopup && <OrganizationPopup handleClose={handleClosePopups} />}
            
            {showAdminPopup && <UserPop handleClose={handleClosePopups} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUpContainer;
