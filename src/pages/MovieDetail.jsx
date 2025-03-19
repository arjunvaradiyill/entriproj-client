import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    API.get(`/movies/${id}`)
      .then((res) => setMovie(res.data.movie))
      .catch(console.error);
  }, [id]);

  const handleAddReview = () => {
    API.post("/movies/review", { movieId: id, user: "Arjun", comment: review, rating })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  return (
    <div className="container">
      {movie ? (
        <>
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <h4>Reviews:</h4>
          {movie.reviews.map((rev) => (
            <div key={rev._id}>
              <strong>{rev.user}</strong>: {rev.comment} ({rev.rating}/10)
              <button onClick={() => API.delete(`/users/review/${rev._id}`).then(() => window.location.reload())}>
                Delete
              </button>
            </div>
          ))}
          <h4>Add Review</h4>
          <input type="text" placeholder="Your Review" value={review} onChange={(e) => setReview(e.target.value)} />
          <input type="number" min="1" max="10" value={rating} onChange={(e) => setRating(e.target.value)} />
          <button onClick={handleAddReview}>Submit</button>
        </>
      ) : (
        <p>Loading movie...</p>
      )}
    </div>
  );
};

export default MovieDetail;
