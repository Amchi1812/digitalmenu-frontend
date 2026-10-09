import React from 'react';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

interface VisitSectionProps {
  restaurantName: string;
}

export const VisitSection: React.FC<VisitSectionProps> = ({ restaurantName }) => {
  return (
    <section className="verdana-visit-section">
      <div className="verdana-visit-container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="verdana-section-tag">Find Us</span>
          <h2 className="verdana-section-title">Visit {restaurantName}</h2>
        </div>

        <div className="verdana-visit-grid">
          
          <div className="verdana-info-card">
            <h3 className="verdana-info-title">Working Hours & Info</h3>

            <div className="verdana-info-list">
              <div className="verdana-info-item">
                <Clock className="verdana-info-icon" size={20} />
                <div>
                  <strong>Mon - Thu:</strong> 09:00 - 23:00<br />
                  <strong>Fri - Sun:</strong> 09:00 - 01:00
                </div>
              </div>

              <div className="verdana-info-item">
                <MapPin className="verdana-info-icon" size={20} />
                <div>
                  <strong>Address:</strong><br />
                  Rue de la Paix 12, Paris
                </div>
              </div>

              <div className="verdana-info-item">
                <Phone className="verdana-info-icon" size={20} />
                <div>
                  <strong>Reservations:</strong><br />
                  +33 1 42 68 55 00
                </div>
              </div>

              <div className="verdana-info-item">
                <Mail className="verdana-info-icon" size={20} />
                <div>
                  <strong>Email:</strong><br />
                  info@verdanabistro.fr
                </div>
              </div>
            </div>

            <a href="tel:+33142685500" className="verdana-btn-gold" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>
              Book a Table
            </a>
          </div>

          
          <div className="verdana-map-wrap">
            <iframe
              title="Restoran Lokacija"
              src="https://maps.google.com/maps?q=Rue%20de%20la%20Paix%2012,%20Paris&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
        </div>
      </div>
    </section>
  );
};