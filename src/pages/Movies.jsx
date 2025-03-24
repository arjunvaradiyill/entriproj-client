import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Rating, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Box,
  Container,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Chip,
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Pagination
} from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import MovieIcon from '@mui/icons-material/Movie'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { fetchMovies, fetchTrendingMovies, addReview } from '../redux/movieSlice'
import MovieCard from '../components/MovieCard'
import { Favorite, FavoriteBorder, RateReview } from '@mui/icons-material'
import { fetchMovies as fetchMoviesFromSlice } from '../store/slices/movieSlice'

// Update fallback image to use a relative path
const FALLBACK_IMAGE = '/images/no-image.jpg'; // Place this image in your public folder

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x400/png?text=No+Poster';

const Movies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Get movies from Redux store
  const { movies, loading, error } = useSelector(state => state.movies);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const moviesPerPage = 8;

  // Fetch movies on component mount
  useEffect(() => {
    console.log('Fetching movies...');
    dispatch(fetchMoviesFromSlice())
      .then(result => {
        console.log('Movies fetched:', result);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Extract all unique genres from movies
  const allGenres = movies ? 
    [...new Set(movies.flatMap(movie => movie.genres || []))]
      .filter(genre => genre) // Remove null/undefined
      .sort() : 
    [];

  // Filter movies based on search term and genre
  const filteredMovies = movies ? movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || 
      (movie.genres && movie.genres.includes(selectedGenre));
    return matchesSearch && matchesGenre;
  }) : [];

  // Pagination
  const indexOfLastMovie = page * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  const toggleFavorite = (movieId) => {
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handleReviewClick = (movieId, e) => {
    e.stopPropagation();
    navigate(`/movies/${movieId}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      {showWelcome && user && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setShowWelcome(false)}
        >
          Welcome, {user.username}! You are now logged in.
        </Alert>
      )}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Movie Collection
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse our collection of movies, rate them, and leave reviews
        </Typography>
        
        {/* Search and Filter */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4, mt: 3 }}>
          <TextField
            fullWidth
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="outlined"
            size="small"
          />
          
          {allGenres.length > 0 && (
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={handleGenreChange}
                label="Genre"
              >
                <MenuItem value="">All Genres</MenuItem>
                {allGenres.map(genre => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && (!movies || movies.length === 0) && (
        <Alert severity="info" sx={{ mb: 4 }}>
          No movies found. Please check back later.
        </Alert>
      )}

      {/* Movie Grid */}
      {!loading && !error && movies && movies.length > 0 && (
        <Grid container spacing={3}>
          {currentMovies.map(movie => (
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
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster || FALLBACK_IMAGE}
                    alt={movie.title}
                    onClick={() => handleMovieClick(movie._id || movie.id)}
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie._id || movie.id);
                    }}
                  >
                    {favorites.includes(movie._id || movie.id) ? 
                      <Favorite color="error" /> : 
                      <FavoriteBorder />
                    }
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }} onClick={() => handleMovieClick(movie._id || movie.id)}>
                  <Typography variant="h6" component="div" gutterBottom noWrap>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={movie.rating || 0} 
                      precision={0.1} 
                      readOnly 
                      size="small" 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {(movie.rating || 0).toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.year || 'Unknown year'}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {movie.genres && movie.genres.map(genre => (
                      <Chip 
                        key={genre} 
                        label={genre} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  
                  {/* Add Review Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RateReview />}
                    fullWidth
                    onClick={(e) => handleReviewClick(movie._id || movie.id, e)}
                    sx={{ mt: 'auto' }}
                  >
                    Review
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Container>
  );
};

export default Movies 