import React from 'react';

const IconButton = ({ icon: Icon, onClick, active = false, tooltip = "", size = 18, className = "" }) => {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all ${className} ${
        active 
        ? 'bg-blue-600 text-white' 
        : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
      }`}
    >
      <Icon size={size} />
    </button>
  );
};

export default IconButton;