import axios from "axios";
import Cookies from "js-cookie";

// Base URL of backend API
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
});

// API Calls
export const getMovies = () => API.get("/movies");
export const addMovieReview = (movieId, reviewData) =>
  API.post(`/movies/review`, { movieId, ...reviewData });
export const deleteReview = (reviewId) => API.delete(`/users/review/${reviewId}`);
export const loginUser = (userData) => API.post("/users/login", userData);
export const getProfile = () => API.get("/users/profile");

export default API;
