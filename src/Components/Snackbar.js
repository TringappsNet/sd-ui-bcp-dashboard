import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function SnackbarContainer({ openSnackbar, onCloseSnackbar, anchorOrigin, message }) {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    setOpen(openSnackbar);
    setErrorMessage(message); // Set the error message received from props
    
    // Open the Snackbar when the message changes
    if (message) {
      setOpen(true);
    }
  }, [openSnackbar, message]);

  const handleClose = () => {
    setOpen(false);
    onCloseSnackbar(); // Notify parent component that Snackbar has been closed
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      message={errorMessage} // Display the error message in the Snackbar
      anchorOrigin={anchorOrigin}
    />
  );
}
