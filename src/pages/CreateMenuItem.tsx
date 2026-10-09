import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CategoryDto, CreateMenuItemDto } from '../types';
import api from '../api/axios';
import { AlertCircle, ArrowLeft, ChevronDown, ImagePlus, Loader2, Save, UtensilsCrossed } from 'lucide-react';
import '../styles/Form.css';
import toast from 'react-hot-toast';

export const CreateMenuItem: React.FC = () => {
    const navigate = useNavigate();


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState<number | ''>('');
    const [categoryId, setCategoryId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const response = await api.get<CategoryDto[]>('admin/categories');
                setCategories(response.data);


                if (response.data.length > 0) {
                    setCategoryId(response.data[0].id);
                }
            } catch (err: any) {
                console.error('Greška pri dohvaćanju kategorija:', err);
                setError('Neuspješno učitavanje kategorija sa servera.');
            } finally {
                setIsLoadingCategories(true);
            }
        };

        fetchCategories();
    }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!categoryId) {
            setError('Molimo odaberite kategoriju za artikal.');
            return;
        }

        try {
            setError(null);
            setIsSubmitting(true);

            let uploadedImageUrl: string | null = null;


            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadRes = await api.post<{ url: string }>('admin/image/upload?folder=items', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                uploadedImageUrl = uploadRes.data.url;
            }


            const payload: CreateMenuItemDto = {
                name,
                description: description.trim() !== '' ? description : null,
                basePrice: Number(basePrice),
                categoryId,
                imageUrl: uploadedImageUrl,
            };

            await api.post('admin/items', payload);


            navigate('/admin/menu-items');

            toast.success('Artikal uspješno kreiran.');
        } catch (err: any) {
            console.error('Greška pri kreiranju artikla:', err);
            if (err.response?.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Greška pri kreiranju artikla.');
            } else {
                setError('Došlo je do greške na serveru pri spašavanju.');
            }
            toast.error('Artikal nije kreiran.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-card" style={{ maxWidth: '650px' }}>
                <div className="form-header">
                    <Link to="/admin/menu-items" className="back-link">
                        <ArrowLeft size={16} /> Nazad na artikle
                    </Link>
                    <h2 className="form-title">Novi Artikal</h2>
                    <p className="form-subtitle">Unesite osnovne informacije o jelu ili piću</p>
                </div>

                {error && (
                    <div className="form-error" style={{ marginBottom: '1.25rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Naziv Artitkla *</label>
                        <input
                            type="text"
                            required
                            placeholder="npr. Pizza Capricciosa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Opis Artitkla</label>
                        <textarea
                            rows={3}
                            placeholder="npr. Pelat, sir, šunka, gljive, masline..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Osnovna Cijena (KM) *</label>
                            <input
                                type="number"
                                step="0.10"
                                min="0"
                                required
                                placeholder="0.00"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="form-input"
                            />

                        </div>

                        <div className="form-group">
                            <label className="form-label">Kategorija *</label>
                            <div style={{
                                position: "relative"
                            }}>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="form-input"
                                    disabled={isLoadingCategories}
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        padding: '0.625rem 1.95rem 0.625rem 1.5rem',
                                        borderRadius: '28px',
                                        border: '1px solid #0d233f',
                                        outline: 'none',
                                        fontSize: '0.9rem',
                                        background: '#122f55ec',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                    }}
                                >
                                    {isLoadingCategories ? (
                                        <option>Učitavanje kategorija...</option>
                                    ) : categories.length === 0 ? (
                                        <option value="">Nema dostupnih kategorija</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))
                                    )}



                                </select>
                                <ChevronDown
                                    size={16}
                                    color="#ffffff"
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                    }}
                                />

                            </div>


                        </div>
                    </div>


                    <div className="form-group">
                        <label className="form-label">Slika Artitkla</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '12px',
                                    border: '2px dashed #cbd5e1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: '#f8fafc',
                                    flexShrink: 0
                                }}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UtensilsCrossed size={28} color="#94a3b8" />
                                )}
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.6rem 1rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#334155',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        border: '1px solid #cbd5e1'
                                    }}
                                >
                                    <ImagePlus size={18} />
                                    {selectedFile ? 'Promijeni sliku' : 'Odaberi sliku'}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {selectedFile && (
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                                        Odabrano: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                        <Link to="/admin/menu-items" className="btn-secondary">
                            Odustani
                        </Link>
                        <button type="submit" disabled={isSubmitting || isLoadingCategories} className="btn-primary">
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    Spremanje...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Sačuvaj Artikal
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};