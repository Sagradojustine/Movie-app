import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';
import pwaHandler from './utils/PWA';

function App() {
  const [theme, setTheme] = useState('dark');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Set the theme class on the document body
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  }, [theme]);

  useEffect(() => {
    // Check for PWA installability
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });

      // Check if there's a waiting service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    // Check for updates periodically
    const updateInterval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(updateInterval);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleUpdateClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    setUpdateAvailable(false);
    window.location.reload();
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  const handleDismissUpdate = () => {
    setUpdateAvailable(false);
  };

  return (
    <MovieProvider>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* PWA Install Prompt */}
        {showInstallPrompt && (
          <div className={`fixed top-4 right-4 left-4 md:left-auto md:right-4 md:w-80 z-50 p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Install App</h3>
                <p className="text-sm opacity-80 mb-3">Install our app for a better experience!</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleInstallClick}
                    className={`px-3 py-2 text-sm rounded-md ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className={`px-3 py-2 text-sm rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PWA Update Notification */}
        {updateAvailable && (
          <div className={`fixed bottom-4 right-4 left-4 md:left-auto md:right-4 md:w-80 z-50 p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-green-800 border border-green-700' : 'bg-green-100 border border-green-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Update Available</h3>
                <p className="text-sm opacity-80 mb-3">A new version is available!</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateClick}
                    className={`px-3 py-2 text-sm rounded-md ${
                      theme === 'dark' 
                        ? 'bg-green-700 hover:bg-green-600 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Update Now
                  </button>
                  <button
                    onClick={handleDismissUpdate}
                    className={`px-3 py-2 text-sm rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MovieProvider>
  );
}

export default App;