// services/youtubeService.js
const GOOGLE_API_KEY = 'AIzaSyBlCuAgxvAuMDtkPqQKOBwKfUGY2K_FdiE';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Demo trailers database for fallback
const DEMO_TRAILERS = {
  'stranger things': 'https://www.youtube.com/embed/b9EkMc79ZSU',
  'avengers': 'https://www.youtube.com/embed/TcMBFSGVi1c',
  'spider man': 'https://www.youtube.com/embed/JfVOs4VSpmA',
  'batman': 'https://www.youtube.com/embed/mqqft2x_Aa4',
  'superman': 'https://www.youtube.com/embed/T6DJcgm3wNY',
  'wonder woman': 'https://www.youtube.com/embed/1Q8fG0TtVAY',
  'the dark knight': 'https://www.youtube.com/embed/EXeTwQWrcwY',
  'inception': 'https://www.youtube.com/embed/YoHD9XEInc0',
  'interstellar': 'https://www.youtube.com/embed/zSWdZVtXT7E',
  'the matrix': 'https://www.youtube.com/embed/vKQi3bBA1y8'
};

const FALLBACK_TRAILER = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export const fetchTrailerUrl = async (movieTitle, useDemoFallback = true) => {
  try {
    // First, try to fetch from YouTube API
    const response = await fetch(
      `${YOUTUBE_SEARCH_URL}?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(movieTitle + ' trailer')}&part=snippet&type=video&maxResults=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Return embed URL instead of watch URL
        return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
      }
    }
    
    // If YouTube API fails or returns no results, use demo fallback if enabled
    if (useDemoFallback) {
      const lowerTitle = movieTitle.toLowerCase();
      const foundKey = Object.keys(DEMO_TRAILERS).find(key => lowerTitle.includes(key));
      
      if (foundKey) {
        return DEMO_TRAILERS[foundKey];
      }
      
      return FALLBACK_TRAILER;
    }
    
    return null;
    
  } catch (error) {
    console.error('Failed to fetch trailer:', error);
    
    // Use demo fallback on error if enabled
    if (useDemoFallback) {
      const lowerTitle = movieTitle.toLowerCase();
      const foundKey = Object.keys(DEMO_TRAILERS).find(key => lowerTitle.includes(key));
      
      if (foundKey) {
        return DEMO_TRAILERS[foundKey];
      }
      
      return FALLBACK_TRAILER;
    }
    
    return null;
  }
};