import { Container, Typography, Paper, Box } from '@mui/material';

function AdminDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Welcome to the admin dashboard. Here you can manage movies, reviews, and users.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminDashboard; 