import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Login.css';
import { jwtDecode} from 'jwt-decode';
import type { JwtPayload } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'SuperAdmin') {
        navigate('/superadmin', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });

      
      const savedToken = localStorage.getItem('token');
      if (savedToken) {

        const decoded = jwtDecode<JwtPayload>(savedToken);
        
        if (decoded.role === 'SuperAdmin') {
          navigate('/superadmin');
        } else {
          navigate('/admin');
        }
      }

      toast.success('Uspješno ste se prijavili');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError('Neispravan e-mail ili lozinka.');
      } else {
        setError('Došlo je do greške na serveru. Pokušajte ponovo.');
      }
      toast.error('Prijava nije uspjela.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-circle">
            <LogIn size={38} color="#1667fe" />
          </div>
          <h2 className="login-title">Digital Menu Admin</h2>
          <p className="login-subtitle">Prijavite se na vaš upravljački račun</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <AlertCircle size={18} className="login-error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">E-mail adresa</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                type="email"
                required
                placeholder="admin@restoran.ba"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">Lozinka</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
          </div>
          <div className='button-div'>

            <button type="submit" disabled={isSubmitting} className="login-button">
                {isSubmitting ? (
                <>
                    <Loader2 size={18} className="login-spinner" />
                    Prijava u toku...
                </>
                ) : (
                'Prijavi se'
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};