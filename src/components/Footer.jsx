// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg mb-4">Audio Description</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Gift Cards</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg mb-4">Help Center</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Cookie Preferences</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Legal Notices</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg mb-4">Media Center</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Investor Relations</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm">&copy; 2024 Netflix Clone. This is a demo project for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;