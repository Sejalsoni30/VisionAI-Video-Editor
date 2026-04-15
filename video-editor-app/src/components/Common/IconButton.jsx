import React from 'react';

const IconButton = ({ icon: Icon, onClick, active = false, tooltip = "" }) => {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        active 
        ? 'bg-blue-600 text-white' 
        : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
      }`}
    >
      <Icon size={18} />
    </button>
  );
};

export default IconButton;