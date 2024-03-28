import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/snackbar.css';

export default function CustomSnackbar({ message, onClose, open }) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar className='mt-4'
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            color="White"
            sx={{ p: 0.5 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
      classes={{
        root: 'customSnackbar', // Apply customSnackbar class
      }}
    />
  );
}
