import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Store, UserPlus, LogOut, X, Menu } from 'lucide-react';
import '../styles/AdminLayout.css';
import '../styles/RestaurantList.css';

export const SuperAdminLayout: React.FC = () => {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="admin-layout">

      {isMobileMenuOpen &&(
        <div className='sidebar-overlay' onClick={closeMobileMenu} />
      )}
      {/* sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} >
        <div className="sidebar-header">
          <Utensils size={24} color="#2563eb" />
          <h1 className="sidebar-title">DigitalMenu</h1>
          <span className="sidebar-badge">Super</span>
          <button
          className="mobile-close-btn"
          onClick={closeMobileMenu}
          aria-label="Zatvori meni"
        >
          <X size={20} />
        </button>

        </div>
        

        <nav className="sidebar-nav">
          <NavLink
            to="/superadmin/restaurants"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMobileMenu}
          >
            <Store size={18} />
            Restorani
          </NavLink>

          <NavLink
            to="/superadmin/create-admin"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMobileMenu}
          >
            <UserPlus size={18} />
            Dodaj Admina
          </NavLink>
        </nav>
      </aside>

      {/* header */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-user-info">
            <div className='header-left'>
              <button className='mobile-toggle-btn'
              onClick={()=> setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={22}/>
              </button>
            </div>
            <div className="user-avatar">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <span className="user-role">Sistemski Administrator</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-button">
            <LogOut size={16} />
            <p className='logout-text'>Odjavi se</p>
          </button>

        </header>


        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};