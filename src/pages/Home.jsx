// Home.jsx
import React, { useState } from 'react';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrailerModal from '../components/TrailerModal';

const Home = () => {
  const { popularMovies, topRatedMovies, nowPlayingMovies, tvShows, loading, getTrailerUrl } = useMovies();
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [currentMovieTitle, setCurrentMovieTitle] = useState('');
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  
  const handleHeroTrailerClick = async () => {
    setLoadingTrailer(true);
    setIsTrailerModalOpen(true);
    setCurrentMovieTitle('Stranger Things');
    
    try {
      const url = await getTrailerUrl('Stranger Things');
      setTrailerUrl(url);
    } catch (error) {
      console.error('Error loading trailer:', error);
      setTrailerUrl(null);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const MovieRow = ({ title, movies, category, isTvShow = false }) => (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <Link 
          to={isTvShow ? `/search?category=tv` : `/search?category=${category}`} 
          className="text-gray-400 hover:text-white flex items-center transition-colors text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          See all <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 px-4 md:px-12 pb-4 scrollbar-hide">
          {movies.map(movie => (
            <div key={movie.imdbID} className="flex-none w-48">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[32rem] mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center cursor-pointer"
          style={{
            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%), url(https://images.unsplash.com/photo-1489599809505-fb40ebc16d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
          }}
          onClick={handleHeroTrailerClick}
        >
          <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Stranger Things</h1>
            <p className="text-gray-200 text-lg mb-6">When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.</p>
            <div className="flex gap-4">
              <button 
                className="px-6 py-2 bg-white text-black rounded flex items-center gap-2 hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHeroTrailerClick();
                }}
              >
                ▶ Play
              </button>
              <button className="px-6 py-2 bg-gray-600 bg-opacity-70 text-white rounded flex items-center gap-2 hover:bg-opacity-50 transition-colors">
                ℹ More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Rows */}
      <MovieRow title="Popular on Netflix" movies={popularMovies} category="popular" />
      <MovieRow title="TV Shows" movies={tvShows} category="tv" isTvShow={true} />
      <MovieRow title="Top Rated" movies={topRatedMovies} category="topRated" />
      <MovieRow title="Now Playing" movies={nowPlayingMovies} category="nowPlaying" />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerModalOpen}
        onClose={() => {
          setIsTrailerModalOpen(false);
          setTrailerUrl(null);
          setCurrentMovieTitle('');
        }}
        trailerUrl={trailerUrl}
        movieTitle={currentMovieTitle}
        loading={loadingTrailer}
      />
    </div>
  );
};

export default Home;