// PWA.js - Progressive Web App Service Worker Handler
class PWAHandler {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.isLocalhost = this.checkIsLocalhost();
  }

  // Check if running on localhost
  checkIsLocalhost() {
    return Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );
  }

  // Register service worker
  async register(config = {}) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // Get public URL and origin
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      
      // Our service worker won't work if PUBLIC_URL is on a different origin
      if (publicUrl.origin !== window.location.origin) {
        return;
      }

      window.addEventListener('load', async () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (this.isLocalhost) {
          // Check if a service worker still exists or not
          await this.checkValidServiceWorker(swUrl, config);

          // Add some additional logging to localhost
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
            );
          });
        } else {
          // Is not localhost. Just register service worker
          await this.registerValidSW(swUrl, config);
        }
      });
    }
  }

  // Register valid service worker
  async registerValidSW(swUrl, config) {
    try {
      this.registration = await navigator.serviceWorker.register(swUrl);
      
      this.registration.onupdatefound = () => {
        const installingWorker = this.registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://cra.link/PWA.'
              );

              this.updateAvailable = true;
              
              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(this.registration);
              }

              // Show update notification to user
              this.showUpdateNotification();
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(this.registration);
              }
            }
          }
        };
      };
    } catch (error) {
      console.error('Error during service worker registration:', error);
    }
  }

  // Check for valid service worker
  async checkValidServiceWorker(swUrl, config) {
    try {
      // Check if the service worker can be found
      const response = await fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
      });
      
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        const registration = await navigator.serviceWorker.ready;
        await registration.unregister();
        window.location.reload();
      } else {
        // Service worker found. Proceed as normal.
        await this.registerValidSW(swUrl, config);
      }
    } catch (error) {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    }
  }

  // Show update notification to user
  showUpdateNotification() {
    // You can customize this to show a notification in your UI
    if (window.confirm(
      'A new version of this app is available! ' +
      'Would you like to reload to update?'
    )) {
      this.skipWaiting();
    }
  }

  // Skip waiting and activate the new service worker
  async skipWaiting() {
    if (!this.registration || !this.registration.waiting) return;
    
    // Tell the service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload the page
    window.location.reload();
  }

  // Check for updates
  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Unregister service worker
  async unregister() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
    }
  }

  // Get current registration
  getRegistration() {
    return this.registration;
  }

  // Check if update is available
  isUpdateAvailable() {
    return this.updateAvailable;
  }

  // Add to Home Screen functionality
  async showAddToHomeScreenPrompt() {
    // Check if the browser supports the BeforeInstallPromptEvent
    if ('BeforeInstallPromptEvent' in window) {
      return new Promise((resolve) => {
        window.deferredPrompt = null;
        
        window.addEventListener('beforeinstallprompt', (e) => {
          // Prevent the mini-infobar from appearing on mobile
          e.preventDefault();
          // Stash the event so it can be triggered later
          window.deferredPrompt = e;
          resolve(e);
        });
      });
    }
    return null;
  }

  // Trigger add to home screen prompt
  async promptAddToHomeScreen() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      window.deferredPrompt = null;
      return outcome;
    }
    return null;
  }
}

// Create singleton instance
const pwaHandler = new PWAHandler();

export default pwaHandler;