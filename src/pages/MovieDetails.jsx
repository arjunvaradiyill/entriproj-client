import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, addReview } from '../store/slices/movieSlice';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Rating,
  Button,
  TextField,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  Backdrop,
  Stack
} from '@mui/material';
import { 
  Person, 
  CalendarToday, 
  AccessTime, 
  Star, 
  Movie, 
  Category, 
  Group, 
  Comment, 
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  Send,
  Close,
  ThumbUp,
  ThumbDown,
  Edit
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FALLBACK_IMAGE = '/images/no-image.jpg';
const CAST_FALLBACK_IMAGE = '/images/no-avatar.jpg';

// Styled components for modern UI
const ReviewButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: '10px 24px',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  }
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.light,
  },
  fontSize: '2.5rem',
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  }
}));

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentMovie, loading, error } = useSelector(state => state.movies);
  const { user } = useSelector(state => state.auth);
  
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [ratingHover, setRatingHover] = useState(-1);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id))
        .unwrap()
        .catch(error => {
          console.error('Error fetching movie details:', error);
          // You could redirect to a 404 page or show an error message
        });
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [dispatch, id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleFavorite = () => {
    if (!currentMovie) return;
    
    const movieId = currentMovie._id || currentMovie.id;
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  const handleReviewSubmit = () => {
    if (!user) {
      // Redirect to login page with return URL
      navigate(`/login?redirect=/movies/${id}`);
      return;
    }
    
    if (userRating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      setReviewError('Please enter a review');
      return;
    }
    
    const reviewData = {
      rating: userRating,
      comment: reviewText
    };
    
    dispatch(addReview({ movieId: id, reviewData }))
      .unwrap()
      .then(() => {
        setOpenReviewDialog(false);
        setReviewText('');
        setUserRating(0);
        setReviewSuccess(true);
      })
      .catch(err => {
        if (err === 'Please login to access this resource') {
          // Token might be expired, redirect to login
          navigate(`/login?redirect=/movies/${id}`);
        } else {
          setReviewError(err || 'Failed to submit review');
        }
      });
  };
  
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewText('');
    setUserRating(0);
    setReviewError('');
  };
  
  const handleCloseSnackbar = () => {
    setReviewSuccess(false);
  };
  
  const handleShareMovie = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMovie.title,
        text: `Check out ${currentMovie.title} on Movie Review App!`,
        url: window.location.href
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
        });
    }
  };
  
  const getRatingLabelText = (value) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return value > 0 ? labels[value - 1] : '';
  };
  
  if (loading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        p: 3
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error === 'Failed to fetch movie' ? 'Movie not found' : error}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The movie you're looking for might have been removed or doesn't exist.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Box>
    );
  }
  
  if (!currentMovie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info" variant="filled" sx={{ mb: 2 }}>
          Movie not found
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/movies')}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }
  
  const isFavorite = favorites.includes(currentMovie._id || currentMovie.id);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/movies')}
        sx={{ mb: 3 }}
      >
        Back to Movies
      </Button>
      
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Movie Header with Backdrop */}
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: 200, sm: 300, md: 400 },
            bgcolor: 'rgba(0,0,0,0.8)',
            backgroundImage: `url(${currentMovie.backdrop || currentMovie.poster || FALLBACK_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)'
            }
          }}
        >
          <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} sx={{ height: '100%', alignItems: 'center' }}>
              <Grid item xs={12} sm={4} md={3}>
                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                  <Box
                    component="img"
                    src={currentMovie.poster || FALLBACK_IMAGE}
                    alt={currentMovie.title}
                    sx={{
                      width: '100%',
                      maxWidth: { xs: 180, sm: 220 },
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                      mx: { xs: 'auto', sm: 0 },
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </Zoom>
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <Fade in={true} timeout={800}>
                  <Box sx={{ color: 'white' }}>
                    <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                      {currentMovie.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating 
                        value={currentMovie.rating || 0} 
                        precision={0.5} 
                        readOnly 
                        sx={{ color: 'gold', mr: 1 }}
                      />
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        {(currentMovie.rating || 0).toFixed(1)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body1" sx={{ mr: 2 }}>
                          {currentMovie.year || 'Unknown'}
                        </Typography>
                        
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body1">
                          {currentMovie.runtime || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {currentMovie.genres && currentMovie.genres.map(genre => (
                        <Chip 
                          key={genre} 
                          label={genre} 
                          sx={{ 
                            mr: 1, 
                            mb: 1, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                          }} 
                        />
                      ))}
                    </Box>
                    
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <ReviewButton 
                        variant="contained" 
                        color="primary"
                        startIcon={<Star />}
                        onClick={() => setOpenReviewDialog(true)}
                      >
                        Write a Review
                      </ReviewButton>
                      
                      <IconButton 
                        onClick={toggleFavorite}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: isFavorite ? 'error.main' : 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                      >
                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      
                      <IconButton 
                        onClick={handleShareMovie}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Stack>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>
        
        {/* Movie Details */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Overview
          </Typography>
          
          <Typography variant="body1" paragraph>
            {currentMovie.description || 'No description available.'}
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {currentMovie.director && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Director
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {currentMovie.director}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          {/* Tabs for Cast, Reviews, etc. */}
          <Box sx={{ width: '100%' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  minWidth: 120,
                  fontWeight: 600
                }
              }}
            >
              <Tab label="Cast" icon={<Group />} iconPosition="start" />
              <Tab 
                label={`Reviews (${currentMovie.reviews?.length || 0})`} 
                icon={<Comment />} 
                iconPosition="start" 
              />
              <Tab label="Similar Movies" icon={<Movie />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {/* Cast Tab */}
          <TabPanel value={tabValue} index={0}>
            {(!currentMovie.cast || currentMovie.cast.length === 0) ? (
              <Alert severity="info">No cast information available</Alert>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {currentMovie.cast.map((actor, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                    <Card sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={CAST_FALLBACK_IMAGE}
                        alt={actor}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {actor}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
          {/* Reviews Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 4 }}>
              <ReviewButton 
                variant="contained" 
                color="primary"
                startIcon={<Edit />}
                onClick={() => setOpenReviewDialog(true)}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Write Your Review
              </ReviewButton>
            </Box>
            
            {(!currentMovie.reviews || currentMovie.reviews.length === 0) ? (
              <Alert severity="info">
                No reviews yet. Be the first to review this movie!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {currentMovie.reviews.map((review, index) => (
                  <Grid item xs={12} key={index}>
                    <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                      <ReviewCard>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              width: 50, 
                              height: 50,
                              mr: 2
                            }}
                          >
                            {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {review.username || 'Anonymous'}
                              </Typography>
                              <Rating value={review.rating} readOnly precision={0.5} />
                            </Box>
                            
                            <Typography variant="body1" paragraph>
                              {review.comment}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                              
                              <Box>
                                <Tooltip title="Helpful">
                                  <IconButton size="small">
                                    <ThumbUp fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Not Helpful">
                                  <IconButton size="small">
                                    <ThumbDown fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </ReviewCard>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
          {/* Similar Movies Tab */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info">
              Similar movies feature coming soon!
            </Alert>
          </TabPanel>
        </Box>
      </Paper>
      
      {/* Modern Review Dialog */}
      <Dialog 
        open={openReviewDialog} 
        onClose={handleCloseReviewDialog} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div" fontWeight="bold">
              Rate & Review
            </Typography>
            <IconButton onClick={handleCloseReviewDialog} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {reviewError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {reviewError}
            </Alert>
          )}
          
          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {currentMovie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <StyledRating
                name="user-rating"
                value={userRating}
                precision={1}
                size="large"
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                  if (reviewError) setReviewError('');
                }}
                onChangeActive={(event, newHover) => {
                  setRatingHover(newHover);
                }}
              />
              
              {userRating > 0 && (
                <Fade in={true}>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 'medium', color: 'primary.main' }}>
                    {getRatingLabelText(ratingHover !== -1 ? ratingHover : userRating)}
                  </Typography>
                </Fade>
              )}
            </Box>
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Your Review"
            placeholder="Share your thoughts about the movie..."
            type="text"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (reviewError) setReviewError('');
            }}
            InputProps={{
              sx: {
                borderRadius: 2
              }
            }}
          />
          
          <Box sx={{ mt: 3, color: 'text.secondary' }}>
            <Typography variant="caption">
              Your review will be posted publicly under your username
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseReviewDialog}
            variant="outlined"
            sx={{ borderRadius: 30, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="primary"
            endIcon={<Send />}
            disabled={!userRating || !reviewText.trim()}
            sx={{ 
              borderRadius: 30, 
              px: 3,
              boxShadow: 2,
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled'
              }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={reviewSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Your review has been submitted successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'success.main',
            borderRadius: 2
          }
        }}
      />
    </Container>
  );
};

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movie-tabpanel-${index}`}
      aria-labelledby={`movie-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default MovieDetails;