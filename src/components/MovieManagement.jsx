import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    poster: '',
    rating: 0
  });

  // Fetch movies
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setMovieForm({
      ...movieForm,
      [e.target.name]: e.target.value
    });
  };

  // Add new movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/movies', movieForm);
      toast.success('Movie added successfully');
      setMovieForm({ title: '', poster: '', rating: 0 });
      fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      toast.error('Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  // Edit movie
  const handleEditMovie = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/movies/${selectedMovie._id}`, movieForm);
      toast.success('Movie updated successfully');
      setDialogOpen(false);
      fetchMovies();
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error('Failed to update movie');
    } finally {
      setLoading(false);
    }
  };

  // Delete movie
  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/movies/${movieId}`);
        toast.success('Movie deleted successfully');
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
        toast.error('Failed to delete movie');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Add Movie Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Movie
            </Typography>
            <Box component="form" onSubmit={handleAddMovie}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={movieForm.title}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Poster URL"
                name="poster"
                value={movieForm.poster}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Initial Rating"
                name="rating"
                type="number"
                value={movieForm.rating}
                onChange={handleInputChange}
                margin="normal"
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                Add Movie
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Movie List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Movie List
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
              {movies.map((movie) => (
                <ListItem key={movie._id}>
                  <ListItemText
                    primary={movie.title}
                    secondary={`Rating: ${movie.rating}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setMovieForm({
                          title: movie.title,
                          poster: movie.poster,
                          rating: movie.rating
                        });
                        setDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteMovie(movie._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={movieForm.title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Poster URL"
            name="poster"
            value={movieForm.poster}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Rating"
            name="rating"
            type="number"
            value={movieForm.rating}
            onChange={handleInputChange}
            margin="normal"
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditMovie} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MovieManagement; 