import React from 'react';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        Welcome to the admin dashboard. More features coming soon.
      </Typography>
    </Container>
  );
};

export default Dashboard;