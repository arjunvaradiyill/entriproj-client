import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { FaStar } from "react-icons/fa";

const MovieList = () => {
    const { user } = useContext(UserContext) || {};
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [newReview, setNewReview] = useState({ rating: 0, text: "" });

    useEffect(() => {
        fetch("http://localhost:8000/api/movies")
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    const submitReview = async () => {
        if (!selectedMovie || !newReview.text.trim() || newReview.rating === 0) {
            alert("Please provide both a rating and a comment.");
            return;
        }

        if (!user || !user.name) {
            alert("You must be logged in to submit a review.");
            return;
        }

        const reviewData = { 
            text: newReview.text.trim(), 
            rating: newReview.rating,
            user: user.name, 
        };

        try {
            const response = await fetch(
                `http://localhost:8000/api/movies/${selectedMovie._id}/add-review`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reviewData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit review");
            }

            const updatedMovie = await response.json();
            setMovies(movies.map(m => 
                m._id === selectedMovie._id ? updatedMovie : m
            ));
            setNewReview({ rating: 0, text: "" }); 
            setSelectedMovie(null);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review: " + error.message);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-black text-white">
            <h1 className="text-3xl font-bold text-center mb-6">🎬 Movie Reviews</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {movies.map((movie) => (
                    <div key={movie._id} className="movie-card">
                        <img src={movie.poster} alt={movie.title} className="movie-poster" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{movie.title}</h3>
                            <p className="movie-rating">⭐ {movie.rating}/10</p>
                            <button
                                className="review-btn"
                                onClick={() => setSelectedMovie(movie)}
                            >
                                Add Review
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="text-xl font-semibold mb-4">Review {selectedMovie.title}</h2>
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                />
                            ))}
                        </div>
                        <textarea
                            className="w-full p-2 border rounded bg-black text-white"
                            placeholder="Write your review..."
                            value={newReview.text}
                            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="close-btn" onClick={() => setSelectedMovie(null)}>Cancel</button>
                            <button className="submit-btn" onClick={submitReview}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;