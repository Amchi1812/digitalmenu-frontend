import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface FooterSectionProps {
  restaurantName: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ restaurantName }) => {
  return (
    <footer className="verdana-footer">
      <div className="verdana-footer-container">
        <div className="verdana-footer-top">
          <div className="verdana-footer-brand">
            <h3 className="verdana-footer-logo">{restaurantName}</h3>
            <p className="verdana-footer-tagline">Where Every Meal Matters.</p>
          </div>

          <div className="verdana-footer-links">
            <a href="#menu-section">Menu</a>
            <a href="#about-section">About Us</a>
            <a href="#visit-section">Contact</a>
            <Link to="/login" className="verdana-footer-admin-link">
              <LogIn size={14} /> Admin
            </Link>
          </div>

          <div className="verdana-footer-socials">
            
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="verdana-footer-bottom">
          <p>&copy; {new Date().getFullYear()} {restaurantName}. All rights reserved.</p>
          <p>Powered by <strong>DigitalMenu</strong></p>
        </div>
      </div>
    </footer>
  );
};