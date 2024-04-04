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
  const [showUserPopup, setshowUserPopup] = useState(false);
  const [timerID, setTimerID] = useState(null);

  const handleResetPopupToggle = () => {
    setShowResetPopup(!showResetPopup);
    setShowInvitePopup(false); // Close invite popup
    setShowOrganizationPopup(false); // Close organization popup
    setshowUserPopup(false); // Close admin popup
  };

  const handleInvitePopupToggle = () => {
    setShowInvitePopup(!showInvitePopup);
    setShowResetPopup(false); // Close reset password popup
    setShowOrganizationPopup(false); // Close organization popup
    setshowUserPopup(false); // Close admin popup
  };

  const handleOrganizationPopupToggle = () => {
    setShowOrganizationPopup(!showOrganizationPopup);
    setshowUserPopup(false); // Close admin popup
    setShowResetPopup(false); // Close reset password popup
    setShowInvitePopup(false); // Close invite popup
  };

  const handleUserPopupToggle = () => {
    setshowUserPopup(!showUserPopup);
    setShowOrganizationPopup(false); // Close organization popup
    setShowResetPopup(false); // Close reset password popup
    setShowInvitePopup(false); // Close invite popup
  };

  const handleClosePopups = () => {
    setShowResetPopup(false);
    setShowInvitePopup(false);
    setShowOrganizationPopup(false);
    setshowUserPopup(false);
    
  };

  const handleResetSuccess = () => {
    setShowResetPopup(false);
  };

  const handleInviteSuccess = () => {
    setShowInvitePopup(false); 
  };

  return (
    <div>
      <div onClick={handleResetPopupToggle} > Reset Password</div>
      <div onClick={handleInvitePopupToggle} > Send Invite</div>

      <div  >Organization</div>
      <div>User</div>

      {(showResetPopup || showInvitePopup || showOrganizationPopup || showUserPopup) && (
        <div className="popup-container">

          <div className="backdrop" ><span className="cancel-symbol " onClick={handleClosePopups}>✖</span>
</div>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            {showResetPopup && <ResetNewPassword onClose={handleResetSuccess} />}
            {showInvitePopup && <SendInvite onClose={handleResetSuccess} />}
            {showOrganizationPopup && <OrganizationPopup handleClose={handleClosePopups} />}
            
            {showUserPopup && <UserPop handleClose={handleClosePopups} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUpContainer;
