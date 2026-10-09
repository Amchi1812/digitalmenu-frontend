import React from 'react';
import { Skeleton } from '../components/common/Skeleton';

export const CategoryTableSkeleton: React.FC = () => {
  return (
    <div className="table-wrapper" style={{ padding: '1rem' }}>
      <table className="restaurants-table" style={{ width: '100%', borderCollapse: 'collapse',  }}>
        
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0'}}>
            <th style={{ padding: '1rem' }}><Skeleton width="50px" height="1.2rem" /></th>
            <th style={{ padding: '1rem' }}><Skeleton width="160px" height="1.2rem" /></th>
            <th style={{ padding: '1rem' }}><Skeleton width="100px" height="1.2rem" /></th>
            <th style={{ padding: '1rem' }}><Skeleton width="80px" height="1.2rem" /></th>
            <th style={{ padding: '1rem' }}><Skeleton width="80px" height="1.2rem" /></th>
            <th style={{ padding: '1rem' }}><Skeleton width="80px" height="1.2rem" /></th>
          </tr>
        </thead>

        
        <tbody>
          {[1, 2, 3, 4, 5].map((index) => (
            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
              
              <td style={{ padding: '1rem' }}>
                <Skeleton width="40px" height="2rem" />
              </td>

              
              <td style={{ padding: '1rem' }}>
                <Skeleton width="110px" height="1.4rem" borderRadius="6px" />
              </td>

              <td style={{ padding: '1rem' }}>
                <Skeleton width="140px" height="0.8rem" />
              </td>

              <td style={{ padding: '1rem' }}>
                <Skeleton width="70px" height="1.6rem" borderRadius="12px" />
              </td>

              

              <td style={{ padding: '1rem' }}>
                <Skeleton width="70px" height="1.6rem" borderRadius="12px" />
              </td>

              <td style={{ padding: '1rem' }}>
                <Skeleton width="70px" height="1.6rem" borderRadius="12px" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};