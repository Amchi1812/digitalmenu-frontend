import { useEffect, useState } from "react"
import type { RestaurantResponseDto } from "../types"
import api from "../api/axios";
import { AlertCircle, Plus, Store } from "lucide-react";
import {  Link } from "react-router-dom";
import { TableSkeleton } from "./TableSkeleton";



export const RstaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<RestaurantResponseDto[]>('/superadmin/restaurants');
      setRestaurants(response.data);
    } catch (err: any) {
      console.error('Greška pri učitavanju restorana:', err);
      setError('Neuspješno učitavanje liste restorana sa servera.');
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants-container">

      <div className="page-header">
        <div>
          <h2 className="page-title">Restorani</h2>
          <p className="page-subtitle">Pregled i upravljanje registrovanim restoranima u sistemu</p>
        </div>


        <Link to="/superadmin/restaurants/new" className="add-button">
          <Plus size={18} />
          Novi Restoran
        </Link>
      </div>


      <div className="table-card">
        {isLoading ? (
          <TableSkeleton/>
        ) : error ? (
          <div className="state-container" style={{ color: '#dc2626' }}>
            <AlertCircle size={32} />
            <p>{error}</p>
            <button
              onClick={fetchRestaurants}
              style={{
                marginTop: '0.5rem',
                padding: '0.7rem 1rem',
                borderRadius: '15px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',

              }}
            >
              Pokušaj ponovo
            </button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="state-container">
            <Store size={40} style={{ color: '#94a3b8' }} />
            <p>Trenutno nema registrovanih restorana u sistemu.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="restaurants-table">
              <thead>
                <tr>
                  <th>Naziv Restorana</th>
                  <th>Slug (URL identifikator)</th>
                  <th>Status</th>
                  <th>ID Restorana</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td style={{ fontWeight: 600 }}>{restaurant.name}</td>
                    <td>
                      <span className="slug-code">/menu/{restaurant.slug}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${restaurant.isActive ? 'badge-active' : 'badge-inactive'
                          }`}
                      >
                        <span className="badge-dot" />
                        {restaurant.isActive ? 'Aktivan' : 'Neaktivan'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {restaurant.id}
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
}