// MovieContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMoviesByCategory, searchMovies } from '../services/movieService';
import { fetchTrailerUrl } from '../services/youtubeService';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Load initial movie data
  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true);
      try {
        // Fetch movies by category
        const [popularResult, topRatedResult, nowPlayingResult, tvShowsResult] = await Promise.all([
          getMoviesByCategory('popular'),
          getMoviesByCategory('topRated'),
          getMoviesByCategory('nowPlaying'),
          searchMovies('series', 1) // Fetch TV shows
        ]);
        
        if (popularResult.success) {
          setPopularMovies(popularResult.movies);
        }
        
        if (topRatedResult.success) {
          setTopRatedMovies(topRatedResult.movies);
        }
        
        if (nowPlayingResult.success) {
          setNowPlayingMovies(nowPlayingResult.movies);
        }
        
        if (tvShowsResult.success) {
          // Filter to only include TV series
          const filteredTvShows = tvShowsResult.movies.filter(
            item => item.Type === 'series'
          );
          setTvShows(filteredTvShows);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching initial movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Watchlist functions
  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.some(item => item.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, { ...movie, addedAt: new Date().toISOString(), watched: false }];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(movie => movie.imdbID !== movieId));
  };

  const toggleWatched = (movieId) => {
    setWatchlist(prev => 
      prev.map(movie => 
        movie.imdbID === movieId 
          ? { ...movie, watched: !movie.watched } 
          : movie
      )
    );
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.imdbID === movieId);
  };

  // Function to get trailer URL
  const getTrailerUrl = async (movieTitle) => {
    try {
      const url = await fetchTrailerUrl(movieTitle);
      return url;
    } catch (error) {
      console.error('Error fetching trailer URL:', error);
      return null;
    }
  };

  // Function to fetch TV shows specifically
  const fetchTvShows = async (searchTerm = 'series', page = 1) => {
    try {
      const result = await searchMovies(searchTerm, page);
      if (result.success) {
        const filteredTvShows = result.movies.filter(item => item.Type === 'series');
        return {
          tvShows: filteredTvShows,
          totalResults: filteredTvShows.length,
          success: true
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      return {
        tvShows: [],
        totalResults: 0,
        success: false,
        error: 'Failed to fetch TV shows'
      };
    }
  };

  const value = {
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    tvShows,
    loading,
    error,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    isInWatchlist,
    getTrailerUrl,
    fetchTvShows
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );  
};