import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';

interface HeaderVerdanaProps {
  restaurantName: string;
}



export const HeaderVerdana: React.FC<HeaderVerdanaProps> = ({ restaurantName }) => {

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);




  const closeMobileNav = () => setIsMobileNavOpen(false);


  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (



    
    <header className={`verdana-header ${isScrolled ? 'scroled':''}`}>

      {isMobileNavOpen &&(
      <div className='overlay' onClick={closeMobileNav}></div>
    )}
      <div className="verdana-header-container">
        <div className="verdana-logo">
          <span>{restaurantName}</span>
        </div>

        <nav className="verdana-nav">
          <a href="#menu-section" >Menu</a>
          <a href="#about-section">About Us</a>
          <a href="#visit-section">Contact Us</a>

        </nav>
        <Link to="/login" className="verdana-admin-btn">
          <LogIn size={16} />
          <span>Admin Login</span>
        </Link>
        <button
          className='open-nav'
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
          <Menu size={22} />
        </button>

      </div>
      <div className={`mobile-bar ${isMobileNavOpen ? 'active' : ''}`}>
        <button className='x' onClick={closeMobileNav}><X size={22} /></button>
        <nav className="verdana-nav-side">
          <a href="#menu-section">Menu</a>
          <a href="#about-section">About Us</a>
          <a href="#visit-section">Contact Us</a>

        </nav>
        <Link to="/login" className="verdana-admin-btn-side">
          <LogIn size={16} />
          <span>Admin Login</span>
        </Link>
        <div className='name'>Verdana Bistro</div>
      </div>
    </header>
  );
};