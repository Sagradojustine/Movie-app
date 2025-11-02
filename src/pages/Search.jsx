// Search.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMovies, getMoviesByCategory } from '../services/movieService';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchTvShows } = useMovies();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    
    setSearchTerm(query || '');
    setCategory(categoryParam || '');
    
    if (query || categoryParam) {
      performSearch(query, categoryParam);
    }
  }, [location.search]);
  
  const performSearch = async (query, categoryParam) => {
    setLoading(true);
    
    try {
      let result;
      
      if (query) {
        result = await searchMovies(query, 1);
      } else if (categoryParam === 'tv') {
        // Special handling for TV shows
        result = await fetchTvShows('series', 1);
      } else if (categoryParam) {
        result = await getMoviesByCategory(categoryParam, 1);
      } else {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      if (result.success) {
        setMovies(result.movies || result.tvShows || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    setSearchTerm(query);
    setCategory('');
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    setSearchTerm('');
    navigate(`/search?category=${categoryId}`);
  };
  
  const categories = [
    { id: 'popular', name: 'Popular' },
    { id: 'topRated', name: 'Top Rated' },
    { id: 'nowPlaying', name: 'Now Playing' },
    { id: 'tv', name: 'TV Shows' },
    { id: 'movie', name: 'Movies' },
    { id: 'new', name: 'New & Popular' }
  ];

  const getPageTitle = () => {
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    if (category) {
      const categoryObj = categories.find(c => c.id === category);
      return categoryObj ? `${categoryObj.name}` : 'Browse Content';
    }
    return 'Search Netflix';
  };

  const getEmptyStateMessage = () => {
    if (searchTerm) {
      return `No results found for "${searchTerm}"`;
    }
    if (category === 'tv') {
      return 'No TV shows found in this category';
    }
    return 'No content found in this category';
  };
  
  return (
    <div className="min-h-screen bg-black pt-20 pb-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            {getPageTitle()}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <SearchBar onSearchResults={handleSearch} />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-2 rounded text-sm whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
        
        {!loading && movies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">{getEmptyStateMessage()}</p>
            <p className="text-gray-500 mt-2">Try different keywords or browse by category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;