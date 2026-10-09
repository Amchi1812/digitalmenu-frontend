import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layers,  LogOut, Menu, Utensils, UtensilsCrossed, X } from "lucide-react";
import '../styles/AdminLayout.css';
import { useEffect, useState } from "react";
import type { RestaurantDto } from "../types";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Skeleton } from "../components/common/Skeleton";

export const RestoranAdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isRestaurantLoading, setIsRestaurantLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [restaurant, setRestaurant] = useState<RestaurantDto | null>(null);

    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Uspješno ste se odjavili.');
    };

    const fetchRestaurant = async () => {
        if (!user?.restaurantId) return;

        try {
            setIsRestaurantLoading(true);
            setError(null);

            const response = await api.get<RestaurantDto>(`/restaurant/${user.restaurantId}`);
            setRestaurant(response.data);
        } catch (err: any) {
            console.error('Greška pri učitavanju restorana:', err);
            setError('Greška pri učitavanju');
        } finally {
            setIsRestaurantLoading(false);
        }
    };

    useEffect(() => {
        if (user?.restaurantId) {
            fetchRestaurant();
        }
    }, [user?.restaurantId]);

    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="admin-layout">
            
            
            {isMobileMenuOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={closeMobileMenu}
                />
            )}

            
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <Utensils size={24} color="#2563eb" />
                        <h1 className="sidebar-title">DigitalMenu</h1>
                        <span className="sidebar-badge">Admin</span>
                    </div>

                    
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
                        to="/admin/categories"
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                        onClick={closeMobileMenu}
                    >
                        <Layers size={18} />
                        Kategorije
                    </NavLink>

                    <NavLink
                        to="/admin/menu-items"
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                        onClick={closeMobileMenu}
                    >
                        <UtensilsCrossed size={18} />
                        Artikli
                    </NavLink>
                </nav>
            </aside>

            
            <div className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        
                        <button 
                            className="mobile-toggle-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Otvori meni"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="header-user-info">
                            <div className="user-avatar">
                                {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="user-details">
                                <span className="user-email">{user?.email}</span>
                                <span className="user-role">Restoran Administrator</span>
                            </div>
                            <div className="restaurant-details">
                                {isRestaurantLoading ? (
                                    <div className="state-container">
                                        <Skeleton width="80px" height="1.8rem"/>
                                    </div>
                                ) : error ? (
                                    <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>Greška</span>
                                ) : (
                                    <span className="restaurant-name">{restaurant?.name}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={16} />
                        <span className="logout-text">Odjavi se</span>
                    </button>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};