// movieService.js
const OMDB_API_KEY = '992fcfdc';
const GOOGLE_API_KEY = 'AIzaSyBlCuAgxvAuMDtkPqQKOBwKfUGY2K_FdiE';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Fetch movies by search term
export const searchMovies = async (searchTerm, page = 1, type = '') => {
  try {
    let url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`;
    
    // Add type parameter if specified
    if (type) {
      url += `&type=${type}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === 'True') {
      return {
        movies: data.Search,
        totalResults: parseInt(data.totalResults),
        success: true
      };
    } else {
      return {
        movies: [],
        totalResults: 0,
        success: false,
        error: data.Error
      };
    }
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      movies: [],
      totalResults: 0,
      success: false,
      error: 'Failed to fetch movies'
    };
  }
};

// Fetch movie details by ID
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      return {
        movie: data,
        success: true
      };
    } else {
      return {
        movie: null,
        success: false,
        error: data.Error
      };
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      movie: null,
      success: false,
      error: 'Failed to fetch movie details'
    };
  }
};

// Get movies by category - uses predefined search terms
export const getMoviesByCategory = async (category, page = 1) => {
  const categoryMap = {
    'popular': 'marvel',
    'topRated': 'star wars',
    'nowPlaying': '2023',
    'tv': 'series',
    'movie': 'movie'
  };
  
  const searchTerm = categoryMap[category] || category;
  const type = category === 'tv' ? 'series' : category === 'movie' ? 'movie' : '';
  
  return await searchMovies(searchTerm, page, type);
};

// Fetch YouTube trailer for a movie
export const searchYoutubeTrailer = async (movieTitle) => {
  try {
    const response = await fetch(`${YOUTUBE_SEARCH_URL}?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(movieTitle + ' trailer')}&part=snippet&type=video&maxResults=1`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return {
        trailerUrl: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`,
        success: true
      };
    } else {
      return {
        trailerUrl: null,
        success: false,
        error: 'No trailer found'
      };
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return {
      trailerUrl: null,
      success: false,
      error: 'Failed to fetch trailer'
    };
  }
};

// Specific function to fetch TV shows
export const getTvShows = async (page = 1) => {
  return await searchMovies('series', page, 'series');
};