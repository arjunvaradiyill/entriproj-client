import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MovieList.css";

const API_URL = "http://localhost:8000/api/movies"; // Update with your actual backend URL

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(API_URL);
            setMovies(response.data);
        } catch (err) {
            console.error("Error fetching movies:", err);
        }
    };

    const submitReview = async () => {
        if (!selectedMovie || !reviewText.trim() || reviewRating < 1 || reviewRating > 5) {
            alert("Please enter a review and select a valid rating.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newReview = {
                user: "Anonymous", // Replace with actual user info if available
                comment: reviewText,
                rating: reviewRating,
            };

            const response = await axios.post(
                `${API_URL}/${selectedMovie._id}/add-review`,
                newReview,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201 || response.status === 200) {
                alert("Review submitted successfully!");
                setReviewText("");
                setReviewRating(5);
                fetchMovies(); // Refresh movie list with new reviews
                setSelectedMovie(null);
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Movie List</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="movie-grid">
                {movies.map((movie) => (
                    <div className="movie-card" key={movie._id}>
                        <img className="movie-poster" src={movie.poster} alt={movie.title} />
                        <h2 className="movie-title">{movie.title}</h2>
                        <p className="movie-rating">⭐ {movie.rating.toFixed(1)}</p>

                        <div className="reviews-container">
                            {movie.reviews.length > 0 ? (
                                movie.reviews.map((rev, index) => (
                                    <div className="review" key={index}>
                                        <strong>{rev.user}:</strong> {rev.comment} ⭐ {rev.rating}
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet</p>
                            )}
                        </div>

                        <button className="review-btn" onClick={() => setSelectedMovie(movie)}>
                            Add Review
                        </button>
                    </div>
                ))}
            </div>

            {selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Review for {selectedMovie.title}</h2>
                        <textarea
                            placeholder="Write your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>

                        <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num} ⭐
                                </option>
                            ))}
                        </select>

                        <button className="submit-btn" onClick={submitReview} disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>

                        <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;
