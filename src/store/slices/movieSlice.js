import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/axiosConfig';

// Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching movies from API...');
      const response = await axios.get('http://localhost:3000/api/movies');
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

// Async thunk for fetching a single movie
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching movie with ID:', id);
      const response = await axios.get(`http://localhost:3000/api/movies/${id}`);
      console.log('Movie data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie');
    }
  }
);

// Async thunk for adding a review
export const addReview = createAsyncThunk(
  'movies/addReview',
  async ({ movieId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Please login to access this resource');
      }
      
      console.log('Adding review with data:', reviewData);
      console.log('Using token:', token.substring(0, 10) + '...');
      
      const response = await axios.post(
        `http://localhost:3000/api/movies/${movieId}/reviews`, 
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Review added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error.response || error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to add review. Please try again.'
      );
    }
  }
);

const initialState = {
  movies: [],
  currentMovie: null,
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovieError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies cases
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch movie by ID cases
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add review cases
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update the current movie with the new review
        if (state.currentMovie && state.currentMovie._id === action.payload._id) {
          state.currentMovie = action.payload;
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMovieError } = movieSlice.actions;
export default movieSlice.reducer; 