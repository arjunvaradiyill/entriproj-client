import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ search = '', genre = '', sort = 'latest', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/movies', {
        params: { search, genre, sort, page }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch movies' });
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/movies/trending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch trending movies' });
    }
  }
);

export const addReview = createAsyncThunk(
  'movies/addReview',
  async ({ movieId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/movies/${movieId}/reviews`, {
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add review' });
    }
  }
);

// Slice
const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    trendingMovies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedMovie: null,
    userReactions: {}
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    updateUserReaction: (state, action) => {
      const { movieId, reaction } = action.payload;
      state.userReactions[movieId] = reaction;
    },
    clearMovieError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch movies';
      })
      // Fetch trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingMovies = action.payload.movies;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch trending movies';
      })
      // Add review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update the movie in the state with new review
        const updatedMovie = action.payload.movie;
        state.movies = state.movies.map(movie =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        );
        if (state.selectedMovie?._id === updatedMovie._id) {
          state.selectedMovie = updatedMovie;
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add review';
      });
  }
});

export const {
  setCurrentPage,
  setSelectedMovie,
  updateUserReaction,
  clearMovieError
} = movieSlice.actions;

export default movieSlice.reducer; 