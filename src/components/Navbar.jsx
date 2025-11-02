// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = location.pathname === '/' && !isScrolled;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navigateToCategory = (category) => {
    navigate(`/search?category=${category}`);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isTransparent ? 'bg-transparent' : 'bg-black'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-netflix-red font-bold text-2xl">
            NETFLIX
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`transition-colors text-sm ${
                location.pathname === '/' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <button 
              onClick={() => navigateToCategory('tv')}
              className={`transition-colors text-sm ${
                location.search.includes('category=tv') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              TV Shows
            </button>
            <button 
              onClick={() => navigateToCategory('movie')}
              className={`transition-colors text-sm ${
                location.search.includes('category=movie') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button 
              onClick={() => navigateToCategory('new')}
              className={`transition-colors text-sm ${
                location.search.includes('category=new') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              New & Popular
            </button>
            <Link 
              to="/watchlist" 
              className={`transition-colors text-sm ${
                location.pathname === '/watchlist' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              My List
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-black bg-opacity-70 border border-gray-600 rounded px-10 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors w-40 lg:w-64"
            />
          </form>
          
          <button className="text-white hover:text-gray-300 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;