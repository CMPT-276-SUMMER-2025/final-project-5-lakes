import { useEffect, useCallback } from 'react';
import { FileDown, Image, FileImage, X } from 'lucide-react';


function downloadChart(format, chartImageUrl) {
  const url = `${chartImageUrl}&format=${format}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `chart.${format.toLowerCase()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function DownloadOptions({ onClose, chartImageUrl }) {
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
      onClick={onClose}
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

        <h3 className="text-gray-800 text-center">Choose Download Format</h3>

        <div className="space-y-4 mt-5">
          <button
            onClick={() => downloadChart('pdf', chartImageUrl)}
            className="w-full bg-blue-600 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 flex items-center justify-center"
          >
            <FileDown className="h-6 w-6 mr-2 flex-shrink-0" />
            Download as PDF
          </button>

          <button
            onClick={() => downloadChart('png', chartImageUrl)}
            className="w-full bg-blue-600 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 flex items-center justify-center"
          >
            <Image className="w-6 h-6 mr-2 flex-shrink-0" />
            Download as PNG
          </button>

          <button
            onClick={() => downloadChart('svg', chartImageUrl)}
            className="w-full bg-blue-600 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 flex items-center justify-center"
          >
            <FileImage className="h-6 w-6 mr-2 flex-shrink-0" />
            Download as SVG
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadOptions;
