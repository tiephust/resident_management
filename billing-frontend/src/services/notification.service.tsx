import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const handleClose = () => {
    setOpen(false);
  };

  const showNotification = (msg: string, sev: AlertColor) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const value = {
    showSuccess: (msg: string) => showNotification(msg, 'success'),
    showError: (msg: string) => showNotification(msg, 'error'),
    showInfo: (msg: string) => showNotification(msg, 'info'),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 