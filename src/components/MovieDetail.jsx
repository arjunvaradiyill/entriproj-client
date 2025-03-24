import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/movies/${id}`, {
          withCredentials: true
        });
        setMovie(response.data.movie);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to load movie details');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!movie) return <div className="text-center p-4">Movie not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-96 w-full object-cover md:w-96"
              src={movie.poster}
              alt={movie.title}
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-600 mb-4">Directed by {movie.director}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((genre, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-6">{movie.description}</p>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Release Date</h2>
              <p className="text-gray-600">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
            </div>
            <a
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors duration-300"
            >
              Watch Trailer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 