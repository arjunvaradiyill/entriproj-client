import React from 'react';
import { useAuth } from '../context/AuthContext';
import MovieList from './MovieList';
import Login from './Login';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <MovieList />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Welcome to Movie App
          </h1>
          <Login />
        </div>
      )}
    </div>
  );
};

export default Home; 