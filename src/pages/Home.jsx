import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Rating,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../store/slices/movieSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movies, loading } = useSelector(state => state.movies);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);
  
  // Get top rated movies
  const topRatedMovies = movies ? 
    [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4) : 
    [];
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{ 
          position: 'relative', 
          backgroundColor: 'grey.800', 
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://source.unsplash.com/random?movie)`,
          height: '60vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', py: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Discover & Review Movies
          </Typography>
          <Typography variant="h5" paragraph>
            Find your next favorite film and share your thoughts with our community
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/movies')}
            sx={{ mt: 2 }}
          >
            Browse Movies
          </Button>
        </Container>
      </Paper>
      
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Top Rated Movies Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Top Rated Movies
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {topRatedMovies.map(movie => (
              <Grid item xs={12} sm={6} md={3} key={movie._id || movie.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => navigate(`/movies/${movie._id || movie.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster || '/images/no-image.jpg'}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={movie.rating || 0} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {(movie.rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'primary.light',
            color: 'primary.contrastText'
          }}
        >
          <Typography variant="h5" gutterBottom>
            {user ? 'Rate and review your favorite movies!' : 'Join our community today!'}
          </Typography>
          <Typography variant="body1" paragraph>
            {user 
              ? 'Share your thoughts and help others discover great films.' 
              : 'Create an account to rate movies, write reviews, and join the discussion.'
            }
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            onClick={() => navigate(user ? '/movies' : '/register')}
          >
            {user ? 'Browse Movies' : 'Sign Up Now'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 