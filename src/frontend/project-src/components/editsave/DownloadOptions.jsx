import { useEffect, useCallback, useState } from 'react';
import { FileDown, Image, FileImage, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';


async function downloadChart(format, chartImageUrl) {
  try {
    const url = `${chartImageUrl}&format=${format}`;
    
    // Fetch the image as a blob
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create a blob URL and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `chart.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    alert('Download failed. Please try again.');
  }
}

function DownloadOptions({ onClose, chartImageUrl }) {
  const [downloading, setDownloading] = useState(null); // Track which format is downloading
  const [downloadSuccessful, setDownloadSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleDownload = async (format) => {
    setDownloading(format);
    try {
      await downloadChart(format, chartImageUrl);
      setDownloadSuccessful(true);
    } catch (error) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleContinueEditing = () => {
    onClose(); 
  };

  const handleMakeAnotherChart = () => {
    navigate('/'); 
    onClose();
  };

  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose(); 
    }
  }, [onClose]); 

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]); 

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => !downloading && onClose()}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {downloadSuccessful ? (
          <div>
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 text-center mb-6">Your chart has been successfully downloaded.</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleContinueEditing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Continue Editing
              </button>
              <button
                onClick={handleMakeAnotherChart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
              >
                Make Another Chart
              </button>
            </div>
          </div>
        ) : (
        <div>
        <h3 className="text-gray-800 text-center">Choose Download Format</h3>

        <div className="space-y-4 mt-5">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading !== null}
            className="w-full bg-blue-600 hover:bg-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none flex items-center justify-center"
          >
            {downloading === 'pdf' ? (
              <Loader2 className="h-6 w-6 mr-2 flex-shrink-0 animate-spin" />
            ) : (
              <FileDown className="h-6 w-6 mr-2 flex-shrink-0" />
            )}
            {downloading === 'pdf' ? 'Downloading...' : 'Download as PDF'}
          </button>

          <button
            onClick={() => handleDownload('png')}
            disabled={downloading !== null}
            className="w-full bg-blue-600 hover:bg-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none flex items-center justify-center"
          >
            {downloading === 'png' ? (
              <Loader2 className="w-6 h-6 mr-2 flex-shrink-0 animate-spin" />
            ) : (
              <Image className="w-6 h-6 mr-2 flex-shrink-0" />
            )}
            {downloading === 'png' ? 'Downloading...' : 'Download as PNG'}
          </button>

          <button
            onClick={() => handleDownload('svg')}
            disabled={downloading !== null}
            className="w-full bg-blue-600 hover:bg-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none flex items-center justify-center"
          >
            {downloading === 'svg' ? (
              <Loader2 className="h-6 w-6 mr-2 flex-shrink-0 animate-spin" />
            ) : (
              <FileImage className="h-6 w-6 mr-2 flex-shrink-0" />
            )}
            {downloading === 'svg' ? 'Downloading...' : 'Download as SVG'}
          </button>
        </div>
      </div>
      )}
    </div>
    </div>
  );
}

export default DownloadOptions;
