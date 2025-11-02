import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/movieService';
import { useMovies } from '../contexts/MovieContext';
import { Star, Clock, Check, Plus, Bookmark, ExternalLink, ThumbsUp, ThumbsDown, Loader, Calendar, Users, Film, Award } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovies();
  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const result = await getMovieDetails(id);
        if (result.success) {
          setMovie(result.movie);
          setError(null);
          // Fetch reviews for this movie
          setReviews([]); // Placeholder for now
        } else {
          setError(result.error || 'Failed to load movie details');
          setMovie(null);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('An error occurred while loading the movie details. Please try again.');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);
  
  const handleToggleWatchlist = () => {
    if (isInWatchlist(id)) {
      removeFromWatchlist(id);
    } else if (movie) {
      addToWatchlist(movie);
    }
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now().toString(),
      movieId: id,
      userName: 'Current User',
      rating: userRating,
      content: reviewContent,
      date: new Date().toISOString(),
      votes: 0
    };
    
    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setReviewContent('');
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl">Loading movie details...</p>
      </div>
    );
  }
  
  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error || 'Movie not found'}</p>
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  const inWatchlist = isInWatchlist(movie.imdbID);
  
  return (
    <div className="pb-8">
      {/* Hero section with movie backdrop and poster */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20 z-10"></div>
        <div className="absolute inset-0 bg-gray-900"></div>
        
        <div className="relative z-20 p-4 md:p-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie poster */}
            <div className="relative flex-shrink-0 w-full md:w-80 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800">
              <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                alt={movie.Title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
            </div>
            
            {/* Movie details */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {movie.Rated !== 'N/A' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-800 text-gray-300">
                    {movie.Rated}
                  </span>
                )}
                {movie.Year && (
                  <span className="text-gray-400 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {movie.Year}
                  </span>
                )}
                {movie.Runtime !== 'N/A' && (
                  <span className="text-gray-400 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.Runtime}
                  </span>
                )}
                {movie.Type && movie.Type !== 'N/A' && (
                  <span className="text-gray-400 text-sm flex items-center">
                    <Film className="w-4 h-4 mr-1" />
                    {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.Title}</h1>
              
              {movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.Genre.split(', ').map(genre => (
                    <span 
                      key={genre} 
                      className="px-3 py-1 text-sm rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Ratings */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.imdbRating !== 'N/A' && (
                  <div className="flex items-center justify-center bg-yellow-500 text-black font-bold rounded-lg px-3 py-2">
                    <Star className="w-5 h-5 mr-1 text-black" />
                    <span>{movie.imdbRating}/10</span>
                  </div>
                )}
                {movie.imdbVotes !== 'N/A' && (
                  <span className="text-gray-400 text-sm flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {parseInt(movie.imdbVotes.replace(/,/g, '')).toLocaleString()} votes
                  </span>
                )}
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <span className="text-gray-400 text-sm flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {movie.Awards}
                  </span>
                )}
              </div>
              
              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Synopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{movie.Plot}</p>
                </div>
              )}
              
              {/* Movie Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Director, Writer, Actors */}
                <div className="space-y-3">
                  {movie.Director !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Director</p>
                      <p className="text-gray-300">{movie.Director}</p>
                    </div>
                  )}
                  {movie.Writer !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Writer</p>
                      <p className="text-gray-300">{movie.Writer}</p>
                    </div>
                  )}
                  {movie.Actors !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Cast</p>
                      <p className="text-gray-300">{movie.Actors}</p>
                    </div>
                  )}
                </div>
                
                {/* Additional Details */}
                <div className="space-y-3">
                  {movie.Language !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Language</p>
                      <p className="text-gray-300">{movie.Language}</p>
                    </div>
                  )}
                  {movie.Country !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Country</p>
                      <p className="text-gray-300">{movie.Country}</p>
                    </div>
                  )}
                  {movie.Released !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Release Date</p>
                      <p className="text-gray-300">{movie.Released}</p>
                    </div>
                  )}
                  {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Box Office</p>
                      <p className="text-gray-300">{movie.BoxOffice}</p>
                    </div>
                  )}
                  {movie.Production && movie.Production !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Production</p>
                      <p className="text-gray-300">{movie.Production}</p>
                    </div>
                  )}
                  {movie.DVD !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">DVD Release</p>
                      <p className="text-gray-300">{movie.DVD}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-8">
                <button 
                  onClick={handleToggleWatchlist}
                  className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                    inWatchlist 
                      ? 'bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-600/30' 
                      : 'bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-600/30'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Bookmark className="w-5 h-5 mr-2" />
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Watchlist
                    </>
                  )}
                </button>
                
                {movie.imdbID && (
                  <a 
                    href={`https://www.imdb.com/title/${movie.imdbID}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View on IMDb
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            {/* Star rating */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Your Rating</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className={`w-8 h-8 flex items-center justify-center ${
                      userRating >= star 
                        ? 'text-yellow-500' 
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                    aria-label={`Rate ${star} stars`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Review content */}
            <div className="mb-4">
              <label htmlFor="review-content" className="block text-sm text-gray-400 mb-2">
                Your Review
              </label>
              <textarea
                id="review-content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none transition-colors"
                placeholder="Share your thoughts about this movie..."
              />
            </div>
            
            <button
              type="submit"
              disabled={userRating === 0 || !reviewContent.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </form>
        </div>
        
        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold">{review.userName}</h4>
                    <div className="flex items-center">
                      <div className="bg-yellow-500/20 text-yellow-500 px-2 rounded mr-2 flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {review.rating}/10
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{review.content}</p>
                <div className="flex items-center gap-4">
                  <button className="text-gray-400 hover:text-blue-400 flex items-center text-sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.votes})
                  </button>
                  <button className="text-gray-400 hover:text-red-400 flex items-center text-sm">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;