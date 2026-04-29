import React from 'react';

const options = [
  { value: 'public', label: 'Public' },
  { value: 'shared', label: 'Shared link' },
  { value: 'discovery', label: 'Discovery only' },
  { value: 'private', label: 'Only me' },
];

export default function VisibilityControl({ value, onChange }) {
  return (
    <div className="visibility-control" role="radiogroup" aria-label="Section visibility">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`visibility-pill ${value === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
