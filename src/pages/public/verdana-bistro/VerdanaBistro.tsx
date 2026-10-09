import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import type { PublicMenuResponseDto } from '../../../types/publicMenu';
import { UtensilsCrossed } from 'lucide-react';
import '../../../styles/public/verdana-bistro/verdana.css';
import { VisitSection } from './components/VisitSection';
import { FooterSection } from './components/FooterSection';
import { HeaderVerdana } from './components/HeaderVerdana';
import { Helmet } from 'react-helmet-async';
import { VerdanaBistroSkeleton } from './components/VerdanaBistroSkeleton';

export const VerdanaBistro: React.FC = () => {
    const [menuData, setMenuData] = useState<PublicMenuResponseDto | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicMenu = async () => {
            try {
                setIsLoading(true);

                const response = await api.get<PublicMenuResponseDto>('menu/verdana-bistro');
                setMenuData(response.data);
            } catch (err: any) {
                console.error('Greška pri učitavanju menija:', err);
                setError('Meni trenutno nije dostupan.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicMenu();
    }, []);

    if (isLoading) {
        return (<VerdanaBistroSkeleton />);
    }

    if (error || !menuData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f4ee', color: '#0d261e' }}>
                <UtensilsCrossed size={48} color="#667e75" />
                <h2 style={{ marginTop: '1rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{error || 'Restoran nije pronađen'}</h2>
            </div>
        );
    }

    // filtriranje artikala na osnovu izabrane kategorije (
    const displayedCategories = activeCategoryId === 'all'
        ? menuData.categories
        : menuData.categories.filter((cat) => cat.id === activeCategoryId);

    return (
        <div className="verdana-container">

            <Helmet>
                {/* Naslov i Opis */}
                <title>{menuData ? `${menuData.name} | Digital Menu` : 'Učitavanje menija...'}</title>
                <meta
                    name="description"
                    content={menuData ? `Pogledajte ponudu jela i pića za ${menuData.name}.` : 'Učitavanje menija...'}
                />
                <meta name="google-site-verification" content="I4ylTqZDGDFQ20m0hvOWOPNcyYErenMVJMgO7o775kI" />

                {/* Favicon sa parametrom za sprečavanje keširanja */}
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="https://api.iconify.design/lucide:utensils.svg?color=%230d261e&v=2"
                />
                <link
                    rel="alternate icon"
                    type="image/png"
                    href="https://api.iconify.design/lucide:utensils.png?color=%230d261e&v=2"
                />

                {/* Open Graph (Facebook, WhatsApp, Viber dijeljenje) */}
                <meta property="og:title" content={menuData ? `${menuData.name} | Digital Menu` : 'Digital Menu'} />
                <meta
                    property="og:description"
                    content={menuData ? `Pogledajte kompletan digitalni meni za ${menuData.name}.` : 'Where Every Meal Matters.'}
                />
                <meta property="og:image" content="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200" />
                <meta property="og:type" content="restaurant" />

                {/* Google Schema.org (JSON-LD) - Renderuje se samo kada menuData postoji da ne baci crash */}
                {menuData && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Restaurant",
                            "name": menuData.name,
                            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Rue de la Paix 12",
                                "addressLocality": "Paris",
                                "addressCountry": "FR"
                            },
                            "servesCuisine": "International",
                            "priceRange": "$$"
                        })}
                    </script>
                )}
            </Helmet>


            <div>
                {/*HEADER SEKCIJA*/}
                <HeaderVerdana restaurantName={menuData.name} />
            </div>
            {/*  HERO SEKCIJA*/}
            <section className="verdana-hero">
                <div className="verdana-hero-content">
                    <span className="verdana-section-tag">Welcome to {menuData.name}</span>
                    <h1 className="verdana-hero-title">
                        Where Every <span>Meal</span> Matters
                    </h1>
                    <p className="verdana-hero-subtitle">
                        Experience culinary perfection crafted with passion, tradition, and the finest organic ingredients.
                    </p>
                    <a href="#menu-section" className="verdana-btn-gold">
                        Explore Menu
                    </a>
                </div>
            </section>

            {/*  ABOUT SEKCIJA */}
            <section className="verdana-about" id='about-section'>
                <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800"
                    alt="Restoran Enterijer"
                    className="verdana-about-img"
                />
                <div>
                    <span className="verdana-section-tag">Our Story</span>
                    <h2 className="verdana-section-title">A Passion for Food, Rooted in Tradition</h2>
                    <p className="verdana-about-text">
                        At Verdana Bistro, we believe dining is an art form. Our chefs combine timeless recipes with modern techniques to bring you an unforgettable gastronomic experience in the heart of the city.
                    </p>
                </div>
            </section>

            {/*   MENI SEKCIJA */}
            <section id="menu-section" className="verdana-menu-section">
                <div className="verdana-menu-container">
                    <div style={{ textAlign: 'center' }}>
                        <span className="verdana-section-tag">Taste The Perfection</span>
                        <h2 className="verdana-section-title">Our Full Menu</h2>
                    </div>


                    <div className="verdana-categories-tabs">
                        <button
                            className={`verdana-tab-btn ${activeCategoryId === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategoryId('all')}
                        >
                            All Dishes
                        </button>
                        {menuData.categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`verdana-tab-btn ${activeCategoryId === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategoryId(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>


                    {displayedCategories.map((category) => (
                        <div key={category.id} style={{ marginBottom: '3.5rem' }}>
                            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#0d261e', marginBottom: '1.5rem', borderBottom: '2px solid #eae4d9', paddingBottom: '0.5rem' }}>
                                {category.name}
                            </h3>

                            <div className="verdana-items-grid">
                                {category.items.map((item) => (
                                    <div key={item.id} className="verdana-item-card">
                                        <div className="verdana-item-img-wrap">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={`${item.name}`}
                                                    className="verdana-item-img"
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                    <UtensilsCrossed size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="verdana-item-body">
                                            <div className="verdana-item-header">
                                                <h4 className="verdana-item-title">{item.name}</h4>
                                                <span className="verdana-item-price">{item.basePrice.toFixed(2)} KM</span>
                                            </div>
                                            {item.description && (
                                                <p className="verdana-item-desc">{item.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/*KONTAKT SEKCIJA */}
            <div id="visit-section">
                <VisitSection restaurantName={menuData.name} />
            </div>

            {/* FOOTER SEKCIJA */}
            <FooterSection restaurantName={menuData.name} />
        </div>
    );
};



