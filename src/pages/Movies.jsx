import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies")
      .then((res) => setMovies(res.data.movies))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Movies List</h2>
      {movies.map((movie) => (
        <div key={movie._id} className="card">
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <p><strong>Rating:</strong> {movie.rating.toFixed(1)}</p>
          <Link to={`/movies/${movie._id}`} className="btn">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default Movies;
