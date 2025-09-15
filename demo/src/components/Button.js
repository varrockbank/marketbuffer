import React from 'react';

export function Button({ children, onClick, variant = 'primary' }) {
  const styles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    danger: 'bg-red-500 text-white'
  };

  return (
    <button
      className={`px-4 py-2 rounded ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
