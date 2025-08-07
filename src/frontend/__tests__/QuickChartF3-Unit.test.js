import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import DownloadOptions from '../project-src/components/editsave/DownloadOptions';
import { MemoryRouter } from 'react-router-dom';


test('renders download buttons', () => {
  render(
    <MemoryRouter>
      <DownloadOptions chartImageUrl="https://example.com/chart.png" />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /Download as PNG/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Download as PDF/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Download as SVG/i })).toBeInTheDocument();
});
