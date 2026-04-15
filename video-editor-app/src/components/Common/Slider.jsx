import React from 'react';

const Slider = ({ label, min = 0, max = 100, value, onChange, unit = '%' }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
        <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};

export default Slider;