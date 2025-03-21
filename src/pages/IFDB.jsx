import React from "react";
import Header from "../components/Header";
import MovieList from "./MovieList"; // Import MovieList
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary

const IFDB = () => {
  return (
    <>
      <Header />
      <ErrorBoundary>
        <MovieList /> {/* Show movies below */}
      </ErrorBoundary>
    </>
  );
};

export default IFDB;
