import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CategoryDto, MenuItemDto } from '../types';
import api from '../api/axios';
import { AlertCircle, ChevronDown, Filter, Plus, UtensilsCrossed } from 'lucide-react';
import '../styles/CategoriesList.css';
import { MenuItemTableSkeleton } from './MenuItemTableSkeleton';
import toast from 'react-hot-toast';

export const MenuItemsList: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [categoriesRes, itemsRes] = await Promise.all([
                api.get<CategoryDto[]>('admin/categories'),
                api.get<MenuItemDto[]>('admin/items')
            ]);

            setCategories(categoriesRes.data);
            setMenuItems(itemsRes.data);
        } catch (err: any) {
            console.error('Greška pri učitavanju artikala:', err);
            setError('Neuspješno učitavanje artikala sa servera.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Da li ste sigurni da želite obrisati ovaj artikal?')) return;

        try {
            setDeleteError(null);
            await api.delete(`admin/items/${id}`);
            setMenuItems((prev) => prev.filter((item) => item.id !== id));
            toast.success('Artikal uspješno obrisan.');
        } catch (err: any) {
            console.error('Greška pri brisanju artikla:', err);
            setDeleteError('Neuspješno brisanje artikla.');
            toast.error('Artikal nije obrisan.');
        }
    };

    const filteredItems = selectedCategoryId === 'all'
        ? menuItems
        : menuItems.filter((item) => item.categoryId === selectedCategoryId);

    return (
        <div className="categories-container">
            <div className="categories-header">
                <div>
                    <h2 className="page-title">Artikli / Meni</h2>
                    <p className="page-subtitle">Pregled i upravljanje jelima i pićima u meniju.</p>
                </div>

                <div>
                    <Link to="/admin/menu-items/new" className="add-button">
                        <Plus size={18} />
                        Novi artikal
                    </Link>
                </div>
            </div>

            {deleteError && (
                <div className="form-error" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={18} />
                    <span>{deleteError}</span>
                </div>
            )}


            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} color="#64748b" />
                <span style={{ fontWeight: 500, color: '#475569' }}>Kategorija:</span>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
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
                        <option value="all">Sve kategorije ({categories.length})</option>
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

            <div className="table-card">
                {isLoading ? (
                    <MenuItemTableSkeleton />
                ) : error ? (
                    <div className="state-container" style={{ color: '#dc2626' }}>
                        <AlertCircle size={32} />
                        <p>{error}</p>
                        <button onClick={fetchData} style={{ marginTop: '0.5rem', padding: '0.7rem 1rem', cursor: 'pointer' }}>
                            Pokušaj ponovo
                        </button>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="state-container">
                        <UtensilsCrossed size={40} style={{ color: '#94a3b8' }} />
                        <p>Nema artikala u ovoj kategoriji.</p>
                    </div>
                ) : (
                    <div className="categiries-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Slika</th>
                                    <th>Naziv artikla</th>
                                    <th>Cijena</th>
                                    <th>Status</th>
                                    <th>Uredi</th>
                                    <th>Obriši</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl} 
                                                    alt={`${item.name}`}
                                                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f1f5f9',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#94a3b8'
                                                    }}
                                                >
                                                    <UtensilsCrossed size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.description}</div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#16a34a' }}>
                                            {item.basePrice.toFixed(2)} KM
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: item.isAvailable ? '#dcfce7' : '#fee2e2',
                                                    color: item.isAvailable ? '#15803d' : '#b91c1c'
                                                }}
                                            >
                                                {item.isAvailable ? 'Dostupno' : 'Nedostupno'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/admin/menu-items/edit/${item.id}`} className="uredi-btn">
                                                Uredi
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="delete">
                                                Obriši
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};