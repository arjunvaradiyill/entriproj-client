import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';

const AuthDebug = () => {
  const auth = useSelector(state => state.auth);
  
  return (
    <Paper sx={{ p: 2, m: 2, maxWidth: 400 }}>
      <Typography variant="h6">Auth Debug</Typography>
      <Box>
        <Typography>Token exists: {auth.token ? 'Yes' : 'No'}</Typography>
        <Typography>Is authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</Typography>
        <Typography>User: {auth.user ? auth.user.username : 'None'}</Typography>
      </Box>
    </Paper>
  );
};

export default AuthDebug; 