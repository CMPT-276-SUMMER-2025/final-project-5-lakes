import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadOptions from '../project-src/components/editsave/DownloadOptions';
import { MemoryRouter } from 'react-router-dom';

// Mock document.createElement and related DOM methods
const mockLink = {
  href: '',
  download: '',
  click: jest.fn(),
};

const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return mockLink;
  }
  return originalCreateElement.call(document, tagName);
});

// Store original methods for our custom render
const originalAppendChild = document.body.appendChild;
const originalRemoveChild = document.body.removeChild;

// Custom render function that provides a container
const customRender = (ui, options = {}) => {
  // Clean up any existing containers
  document.body.innerHTML = '';
  
  // Create a fresh container using the original appendChild
  const container = document.createElement('div');
  originalAppendChild.call(document.body, container);
  
  return render(ui, {
    container,
    ...options,
  });
};

// Mock document methods after defining custom render
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

describe('DownloadOptions Component', () => {
  const mockChartImageUrl = 'https://example.com/chart.png';
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLink.click.mockClear();
    mockLink.href = '';
    mockLink.download = '';
    
    // Reset fetch mock
    global.fetch.mockClear();
    
    // Reset URL mocks
    global.URL.createObjectURL.mockClear();
    global.URL.revokeObjectURL.mockClear();
    
    // Reset alert mock
    global.alert.mockClear();
  });

  test('renders download buttons', () => {
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Download as PNG/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download as PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download as SVG/i })).toBeInTheDocument();
  });

  test('downloads PNG when PNG button is clicked', async () => {
    // Mock successful fetch response
    const mockBlob = new Blob(['fake-png-data'], { type: 'image/png' });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Find and click the PNG download button
    const pngButton = screen.getByRole('button', { name: /Download as PNG/i });
    await act(async () => {
      await user.click(pngButton);
    });

    // Wait for the download process to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${mockChartImageUrl}&format=png`);
    });

    // Verify that the download link was created and clicked
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe('mocked-blob-url');
    expect(mockLink.download).toBe('chart.png');
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mocked-blob-url');
  });

  test('downloads PDF when PDF button is clicked', async () => {
    // Mock successful fetch response
    const mockBlob = new Blob(['fake-pdf-data'], { type: 'application/pdf' });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Find and click the PDF download button
    const pdfButton = screen.getByRole('button', { name: /Download as PDF/i });
    await act(async () => {
      await user.click(pdfButton);
    });

    // Wait for the download process to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${mockChartImageUrl}&format=pdf`);
    });

    // Verify that the download link was created and clicked
    expect(mockLink.download).toBe('chart.pdf');
    expect(mockLink.click).toHaveBeenCalled();
  });

  test('downloads SVG when SVG button is clicked', async () => {
    // Mock successful fetch response
    const mockBlob = new Blob(['fake-svg-data'], { type: 'image/svg+xml' });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Find and click the SVG download button
    const svgButton = screen.getByRole('button', { name: /Download as SVG/i });
    await act(async () => {
      await user.click(svgButton);
    });

    // Wait for the download process to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${mockChartImageUrl}&format=svg`);
    });

    // Verify that the download link was created and clicked
    expect(mockLink.download).toBe('chart.svg');
    expect(mockLink.click).toHaveBeenCalled();
  });

  test('shows loading state when downloading', async () => {
    // Mock a slow fetch response
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['data'])),
      }), 100))
    );

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Click the PNG button
    const pngButton = screen.getByRole('button', { name: /Download as PNG/i });
    await act(async () => {
      await user.click(pngButton);
    });

    // Check that the button shows loading state
    expect(screen.getByText('Downloading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Downloading.../i })).toBeDisabled();
  });

  test('handles download failure gracefully', async () => {
    // Mock failed fetch response
    global.fetch.mockRejectedValueOnce(new Error('Download failed'));

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Click the PNG button
    const pngButton = screen.getByRole('button', { name: /Download as PNG/i });
    await act(async () => {
      await user.click(pngButton);
    });

    // Wait for the error to be handled
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Download failed. Please try again.');
    });
  });

  test('shows success message after successful download', async () => {
    // Mock successful fetch response
    const mockBlob = new Blob(['fake-data'], { type: 'image/png' });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const user = userEvent.setup();
    
    customRender(
      <MemoryRouter>
        <DownloadOptions chartImageUrl={mockChartImageUrl} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Click the PNG button
    const pngButton = screen.getByRole('button', { name: /Download as PNG/i });
    await act(async () => {
      await user.click(pngButton);
    });

    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your chart has been successfully downloaded.')).toBeInTheDocument();
    });

    // Check for the success buttons
    expect(screen.getByRole('button', { name: /Continue Editing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Make Another Chart/i })).toBeInTheDocument();
  });
});
