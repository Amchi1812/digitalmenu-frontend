import React from 'react';
import { useParams } from 'react-router-dom';
import { VerdanaBistro } from './verdana-bistro/VerdanaBistro';

export const PublicMenuSwitch: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const hostname = window.location.hostname; 

  switch (hostname) {
    case 'verdanabistro.fr':
    case 'www.verdanabistro.fr':
    case 'jelovnik.verdanabistro.fr':
      return <VerdanaBistro />;
  }

 
  switch (slug) {
    case 'verdana-bistro':
      return <VerdanaBistro />;
    
    

    default:
      return (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f7f4ee', minHeight: '100vh' }}>
          <h2>Restoran nije pronađen</h2>
          <p>Provjerite unesenu adresu ili QR kod.</p>
        </div>
      );
  }
};