import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import type { CategoryDto, CreateCategoryDto } from "../types";
import api from "../api/axios";
import { AlertCircle, ArrowLeft, Loader2, Store } from "lucide-react";
import '../styles/Form.css';
import toast from "react-hot-toast";


export const CreateCategory: React.FC = () => {
    const [name, setName] = useState('');
    const [displayOrder, setDisplayOrder] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent) => {
        try {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);

            const payload: CreateCategoryDto = { name, displayOrder };

            await api.post<CategoryDto>('admin/categories', payload);

            navigate('/admin/categories');
            toast.success('Kategorija uspješno kreirana.');
        } catch (err: any) {
            console.error('Greška pri kreiranju kategorije:', err);
            setError('Došlo je do greške na serveru. Pokušajte ponovo.');
            toast.error('Neuspješno kreiranje kategorije.')
        } finally {
            setIsSubmitting(false);
        }


    }

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <Link to="/admin/categories" className="back-link">
                        <ArrowLeft size={16} /> Nazad na kategorije
                    </Link>
                    <h2 className="form-title">Kreiraj Novu Kategoriju</h2>
                    <p className="form-subtitle">Unesite osnovne podatke za novu kategoriju u sistemu</p>
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
                            onChange={(e)=> setName(e.target.value)}
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
                                    <Store size={18} />
                                    Sačuvaj Kategoriju
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
