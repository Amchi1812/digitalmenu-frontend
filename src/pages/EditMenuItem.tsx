import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { CategoryDto, MenuItemDto, UpdateMenuItemDto } from '../types';
import api from '../api/axios';
import { AlertCircle, ArrowLeft, ChevronDown, ImagePlus, Loader2, Save, UtensilsCrossed } from 'lucide-react';
import '../styles/Form.css';
import toast from 'react-hot-toast';

export const EditMenuItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState<number | ''>('');
    const [categoryId, setCategoryId] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);


                const [categoriesRes, itemRes] = await Promise.all([
                    api.get<CategoryDto[]>('admin/categories'),
                    api.get<MenuItemDto>(`admin/items/${id}`)
                ]);

                setCategories(categoriesRes.data);

                const item = itemRes.data;
                setName(item.name);
                setDescription(item.description || '');
                setBasePrice(item.basePrice);
                setCategoryId(item.categoryId);
                setIsAvailable(item.isAvailable);
                setExistingImageUrl(item.imageUrl || null);
            } catch (err: any) {
                console.error('Greška pri učitavanju artikla:', err);
                setError('Neuspješno učitavanje podataka o artiklu.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!id || !categoryId) return;

        try {
            setError(null);
            setIsSubmitting(true);

            let finalImageUrl = existingImageUrl;


            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadRes = await api.post<{ url: string }>('admin/image/upload?folder=items', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                finalImageUrl = uploadRes.data.url;
            }


            const payload: UpdateMenuItemDto = {
                name,
                description: description.trim() !== '' ? description : null,
                basePrice: Number(basePrice),
                isAvailable,
                categoryId,
                imageUrl: finalImageUrl,
            };

            await api.put(`admin/items/${id}`, payload);


            navigate('/admin/menu-items');

            toast.success('Artikal uspješno uređen.');
        } catch (err: any) {
            console.error('Greška pri ažuriranju artikla:', err);
            if (err.response?.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Greška pri spašavanju izmjena.');
            } else {
                setError('Došlo je do greške na serveru pri spašavanju.');
            }
            toast.error('Artikal nije uređen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="form-container">
                <div className="form-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <Loader2 size={32} className="spinner" />
                    <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>Učitavanje artikla...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-card" style={{ maxWidth: '650px' }}>
                <div className="form-header">
                    <Link to="/admin/menu-items" className="back-link">
                        <ArrowLeft size={16} /> Nazad na artikle
                    </Link>
                    <h2 className="form-title">Uredi Artikal</h2>
                    <p className="form-subtitle">Izmijenite informacije ili status dostupnosti artikla</p>
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
                                step="0.1"
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
                            <div style={{ position: 'relative' }}>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="form-input"
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
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
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


                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                userSelect: 'none',
                                fontWeight: 500,
                                color: '#334155',
                                
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            Artikal je dostupan za naručivanje
                        </label>
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
                                ) : existingImageUrl ? (
                                    <img src={`${existingImageUrl}`} alt="Postojeća" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    {selectedFile ? 'Promijeni novu sliku' : existingImageUrl ? 'Zamijeni sliku' : 'Odaberi sliku'}
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