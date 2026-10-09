import React from 'react';
import { Skeleton } from '../../../../components/common/Skeleton';

export const VerdanaBistroSkeleton: React.FC = () => {
  return (
    <div className="verdana-container" style={{ backgroundColor: '#f7f4ee', minHeight: '100vh' }}>
      
      
      <div style={{ height: '70vh', backgroundColor: '#0d261e', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Skeleton width="180px" height="1.5rem" borderRadius="20px" style={{ backgroundColor: '#1d3f34', marginBottom: '1.5rem' }} />
        <Skeleton width="60%" height="3.5rem" style={{ backgroundColor: '#1d3f34', marginBottom: '1rem' }} />
        <Skeleton width="40%" height="1.2rem" style={{ backgroundColor: '#1d3f34', marginBottom: '2rem' }} />
        <Skeleton width="150px" height="3rem" borderRadius="25px" style={{ backgroundColor: '#1d3f34' }} />
      </div>

      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Skeleton width="140px" height="1rem" style={{ margin: '0 auto 0.5rem auto' }} />
          <Skeleton width="250px" height="2.5rem" style={{ margin: '0 auto' }} />
        </div>

        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <Skeleton width="100px" height="2.5rem" borderRadius="20px" />
          <Skeleton width="110px" height="2.5rem" borderRadius="20px" />
          <Skeleton width="90px" height="2.5rem" borderRadius="20px" />
          <Skeleton width="120px" height="2.5rem" borderRadius="20px" />
        </div>

        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              <Skeleton height="180px" borderRadius="8px" style={{ marginBottom: '1rem' }} />
              
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <Skeleton width="60%" height="1.4rem" />
                <Skeleton width="25%" height="1.4rem" />
              </div>
              
              
              <Skeleton width="100%" height="0.9rem" style={{ marginBottom: '0.4rem' }} />
              <Skeleton width="80%" height="0.9rem" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};