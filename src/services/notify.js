let showSnackbar = null;

export const registerSnackbar = (fn) => {
    showSnackbar = fn;
};

export const notify = {
    success: (message) => {
        showSnackbar?.(message,'success');
    },
    error: (message) => {
        showSnackbar?.(message, "error");
    },
     warning: (message) => {
    showSnackbar?.(message, "warning");
  },
  info: (message) => {
    showSnackbar?.(message, "info");
  },
};