import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/movies', {
          withCredentials: true
        });
        console.log('Movies data:', response.data);
        setMovies(response.data.movies || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (movies.length === 0) return <div className="text-center p-4">No movies found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div 
            key={movie._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{movie.director}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genre.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {movie.description}
              </p>
              <button
                onClick={() => navigate(`/movie/${movie._id}`)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList; 