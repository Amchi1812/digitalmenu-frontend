import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { CategoryDto, UpdateCategoryDto } from '../types';
import api from '../api/axios';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import '../styles/Form.css';
import toast from 'react-hot-toast';

export const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<CategoryDto>(`admin/categories/${id}`);
        setName(response.data.name);
        setDisplayOrder(response.data.displayOrder);
      } catch (err: any) {
        console.error('Greška pri učitavanju kategorije:', err);
        setError('Neuspješno učitavanje podataka kategorije sa servera.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setError(null);
      setIsSubmitting(true);

      const payload: UpdateCategoryDto = { name, displayOrder };

      await api.put(`admin/categories/${id}`, payload);

      
      navigate('/admin/categories');

      toast.success('Kategorija uređena.');
    } catch (err: any) {
      console.error('Greška pri ažuriranju kategorije:', err);
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Greška pri unosu podataka.');
      } else {
        setError('Došlo je do greške na serveru pri spašavanju.');
        toast.error('Kategorija nije uređena.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="form-container">
        <div className="form-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Loader2 size={32} className="spinner" />
          <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>Učitavanje kategorije...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/admin/categories" className="back-link">
            <ArrowLeft size={16} /> Nazad na kategorije
          </Link>
          <h2 className="form-title">Uredi Kategoriju</h2>
          <p className="form-subtitle">Izmijenite naziv ili redoslijed prikaza kategorije</p>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Naziv Kategorije</label>
            <input
              type="text"
              required
              placeholder="npr. Deserti"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Red Prikaza</label>
            <input
              type="number"
              required
              placeholder="npr. 3"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <Link to="/admin/categories" className="btn-secondary">
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
                  <Save size={18} />
                  Sačuvaj Izmjene
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};