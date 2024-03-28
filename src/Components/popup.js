import React, { useState } from 'react';
import ResetNewPassword from './resetNewPassword';
import SendInvite from './sendInvite';
import '../styles/popup.css'; 


const PopUpContainer = () => {
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  const handleResetPopupToggle = () => {
    setShowResetPopup(!showResetPopup);
    setShowInvitePopup(false); // Close invite popup
  };

  const handleInvitePopupToggle = () => {
    setShowInvitePopup(!showInvitePopup);
    setShowResetPopup(false); // Close reset password popup
  };

  const handleClosePopups = () => {
    setShowResetPopup(false);
    setShowInvitePopup(false);
  };

  const handleResetSuccess = () => {
    setShowResetPopup(false); // Close reset password popup
  };

  return (
    <div>
      <button onClick={handleResetPopupToggle} className='reset'> Reset Password</button>
      <button onClick={handleInvitePopupToggle} className='invite'> Send Invite</button>
      {(showResetPopup || showInvitePopup) && (
        <div className="popup-container">
          <div className="backdrop" onClick={handleClosePopups}></div>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            {showResetPopup && <ResetNewPassword onClose={handleResetSuccess} />}
            {showInvitePopup && <SendInvite />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUpContainer;
