import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import '../styles/snackbar.css';
import SnackbarContent from '@mui/material/SnackbarContent';

export default function CustomSnackbar({ message, variant, onClose, open }) {

  // console.log(message, variant, onClose, open);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  let bgColor = ''; 
  if (variant === 'success') {
    bgColor = '#82c971'; // Green color for success variant
  } else if (variant === 'error') { 
     bgColor = '#D16E6E'; 
  }

// console.log(bgCo lor)

const action = (
  <React.Fragment>
    
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </React.Fragment>
);

return (
  <div>
    {/* <Button onClick={handleClick}>Open Snackbar</Button> */}

    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={3000}

      action={action}
    >
     <SnackbarContent
          style={{ backgroundColor: `${bgColor}`,width:'700px' }}
          message={message}
        />
      </Snackbar>
  </div>
);
}