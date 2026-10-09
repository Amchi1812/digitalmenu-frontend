import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { CreateRestaurantAdminDto, RestaurantResponseDto } from '../types';
import { UserPlus, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import '../styles/Form.css';
import toast from 'react-hot-toast';

export const CreateRestaurantAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  
  const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoadingRestaurants(true);
        const response = await api.get<RestaurantResponseDto[]>('/superadmin/restaurants');
        setRestaurants(response.data);
        
        
        if (response.data.length > 0) {
          setRestaurantId(response.data[0].id);
        }
      } catch (err) {
        console.error('Greška pri učitavanju restorana:', err);
        setError('Neuspješno učitavanje liste restorana za dodjelu.');
      } finally {
        setIsLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (!restaurantId) {
      setError('Molimo odaberite restoran kojem dodjeljujete admina.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateRestaurantAdminDto = {
        email,
        password,
        restaurantId,
      };

      
      await api.post('/superadmin/users', payload);

      
      navigate('/superadmin/restaurants');
      toast.success('Restoran Admin uspješno kreiran.');
    } catch (err: any) {
      console.error('Greška pri kreiranju admina:', err);
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Greška pri unosu podataka.');
      } else {
        setError('Došlo je do greške na serveru. Pokušajte ponovo.');
      }

      toast.error('Restoran Admin nojee uspješno kreiran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/superadmin/restaurants" className="back-link">
            <ArrowLeft size={16} /> Nazad na restorane
          </Link>
          <h2 className="form-title">Kreiraj Admina Restorana</h2>
          <p className="form-subtitle">Dodijelite upravljački račun novom ili postojećem restoranu</p>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">E-mail adresa admina</label>
            <input
              type="email"
              required
              placeholder="admin@restoran.ba"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lozinka za pristup</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Odaberite Restoran</label>
            {isLoadingRestaurants ? (
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Učitavanje restorana...</div>
            ) : restaurants.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                Nema dostupnih restorana. Prvo kreirajte bar jedan restoran.
              </div>
            ) : (
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="form-select"
                required
              >
                {restaurants.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name} (/menu/{res.slug})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-actions">
            <Link to="/superadmin/restaurants" className="btn-secondary">
              Odustani
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingRestaurants || restaurants.length === 0}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Kreiranje...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Sačuvaj Admina
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};