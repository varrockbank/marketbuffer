import React, { useState } from 'react';

export function Sidebar({ items, onSelect }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <nav className="sidebar">
      {items.map(item => (
        <div key={item.id} className="sidebar-item">
          <span onClick={() => onSelect(item)}>{item.label}</span>
          {item.children && (
            <button onClick={() => toggleExpand(item.id)}>
              {expanded[item.id] ? '−' : '+'}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
