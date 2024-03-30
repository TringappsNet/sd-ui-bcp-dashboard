import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import '../styles/snackbar.css';

export default function CustomSnackbar({ message, variant, onClose, open }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  let backgroundColor = '#D16E6E'; 
  if (variant === 'success') {
    backgroundColor = '#82c971'; // Green color for success variant
  }

  // Close the Snackbar after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Stack spacing={2} sx={{ maxWidth: 600 }}>
      <Snackbar
        className='mt-4'
        sx={{ maxWidth: 600, backgroundColor }} 
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
          root: 'customSnackbar',
        }}
      />
    </Stack>
  );
}
