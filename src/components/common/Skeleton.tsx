import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '8px',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-base ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e2e8f0',
        ...style,
      }}
    />
  );
};