import React from 'react';
import '../styling/buttons.css';
import '../styling/fonts.css';
import '../styling/grids.css';

export const Preview = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="heading-1">Style Preview</h1>

      <h2 className="heading-2">Buttons</h2>
      <div className="grid grid-cols-responsive grid-gap-md">
        <button className="button button-primary">Primary</button>
        <button className="button button-secondary">Secondary</button>
        <button className="button button-success">Success</button>
        <button className="button button-danger">Danger</button>
        <button className="button button-outline">Outline</button>
        <button className="button button-ghost">Ghost</button>
        <button className="button button-shadow">Shadow</button>
        <button className="button button-icon">★</button>
        <button className="button" disabled>Disabled</button>
      </div>

      <h2 className="heading-2">Fonts</h2>
      <p className="text-normal font-roboto">This is Roboto (normal text)</p>
      <p className="text-large font-montserrat">This is Montserrat (large text)</p>
      <p className="text-small font-serif">This is Serif (small text)</p>
      <p className="text-xlarge font-mono">This is Monospace (x-large text)</p>

      <h2 className="heading-2">Grid Examples</h2>
      <div className="grid grid-cols-4 grid-gap-sm" style={{ background: "#f9fafb", padding: '1rem' }}>
        <div style={{ background: "#93c5fd", padding: '1rem' }}>1</div>
        <div style={{ background: "#93c5fd", padding: '1rem' }}>2</div>
        <div style={{ background: "#93c5fd", padding: '1rem' }}>3</div>
        <div style={{ background: "#93c5fd", padding: '1rem' }}>4</div>
      </div>
    </div>
  );
}