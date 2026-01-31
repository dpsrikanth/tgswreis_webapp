import React,{ useEffect, useState } from 'react';
import {Snackbar,Alert} from "@mui/material";
import { registerSnackbar } from '../services/notify';

const NotificationProvider = ({children}) => {
    const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    registerSnackbar((msg, type = "success") => {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    });
  }, []);

  return (
    <>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default NotificationProvider