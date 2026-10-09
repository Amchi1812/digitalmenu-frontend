import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { CreateRestaurantDto, RestaurantResponseDto } from '../types';
import { Store, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import '../styles/Form.css';
import toast from 'react-hot-toast';

export const CreateRestaurant: React.FC = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Logika za automatsko pretvaranje Naziva u Slug (npr. "Restoran Mlin" -> "restoran-mlin")
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    const autoSlug = newName
      .toLowerCase()
      .trim()
      .replace(/[čć]/g, 'c')
      .replace(/[š]/g, 's')
      .replace(/[đ]/g, 'dj')
      .replace(/[ž]/g, 'z')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: CreateRestaurantDto = { name, slug };
      
      await api.post<RestaurantResponseDto>('/superadmin/restaurants', payload);

      
      navigate('/superadmin/restaurants');
      toast.success('Restoran uspješno kreiran.');
    } catch (err: any) {
      console.error('Greška pri kreiranju restorana:', err);
      
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Greška pri unosu podataka.');
      } else {
        setError('Došlo je do greške na serveru. Pokušajte ponovo.');
      }
      toast.error('Restoran nije kreiran.');
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
          <h2 className="form-title">Kreiraj Novi Restoran</h2>
          <p className="form-subtitle">Unesite osnovne podatke za novi restoran u sistemu</p>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Naziv Restorana</label>
            <input
              type="text"
              required
              placeholder="npr. Restoran Mlin"
              value={name}
              onChange={handleNameChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug (URL identifikator)</label>
            <input
              type="text"
              required
              placeholder="npr. restoran-mlin"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="form-input"
            />
            <span className="form-hint">
              Putanja menija za goste: <strong>/menu/{slug || 'naziv-restorana'}</strong>
            </span>
          </div>

          <div className="form-actions">
            <Link to="/superadmin/restaurants" className="btn-secondary">
              Odustani
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Spremanje...
                </>
              ) : (
                <>
                  <Store size={18} />
                  Sačuvaj Restoran
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};