import { ChevronLeft, CirclePlus, Download } from 'lucide-react';
import useWarningAlert from '../../hooks/useWarningAlert';
import DefaultWarning from '../messages/DefaultWarning';
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import DownloadOptions from '../editsave/DownloadOptions';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-selected`;
const resetUrl = `${import.meta.env.VITE_API_BASE_URL}/reset-session`

function EditSaveButtons({ chartImageUrl }) {

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
  isWarningVisible,
  warningConfig,
  showWarning,
  hideWarning,
} = useWarningAlert();

    const location = useLocation();
    const { chartConfig } = location.state || {};

    const editConfig = {
        chartLabel: chartConfig.chartLabel,
        chartData: chartConfig.chartData,
        chartOptions: chartConfig.chartOptions,
        chartStyle: chartConfig.chartStyle,
        chartTheme: chartConfig.chartTheme,
    };

    const handleGoToLastStep = async () => {
        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(editConfig),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                const error = new Error(data.error || 'Something went wrong')
                error.code = data.code || '';
                throw error;
            }
            return data;
        })
        .then(data => {
            navigate("/visual-select", { state: data });
        })
        .catch(error => {
            alert(error.message, 'Please try again.');
        });
    }

    const goBackHomepage = async () => {
        try {
            await fetch(resetUrl, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            navigate("/");
        } catch (err) {
            alert("Something went wrong generating the chart.");
        }
    };

    return (
        <div className="flex justify-between mt-10 flex-wrap gap-4">
            <button
                onClick={handleGoToLastStep}
                className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <ChevronLeft size={25} className="mr-2" />
                Go to the last step
            </button>

      <button
        onClick={() => {
            showWarning(
              'Did you download your chart?',
              'Your progress will not be saved if you start creating a new chart. Please make sure you downloaded your chart if needed.',
              'Make a New Chart'
            );
          }}
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <CirclePlus size={25} className="mr-3" />
        Create another chart
      </button>

      <button
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
        onClick={() => setIsDownloadModalOpen(true)}
      >
        <Download size={18} strokeWidth={4} className="mr-2" />
        Download this chart
      </button>

      {isWarningVisible && (
        <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center">
          <DefaultWarning
            isVisible={isWarningVisible}
            title={warningConfig.title}
            message={warningConfig.message}
            buttonText={warningConfig.buttonText}
            onButtonClick={() => {
              hideWarning();
              goBackHomepage();
            }}
            onCancel={() => {
              hideWarning(); 
            }}
            cancelText="Cancel"
          />
        </div>
      )}

      {isDownloadModalOpen && (
        <DownloadOptions
          onClose={() => setIsDownloadModalOpen(false)}
          chartImageUrl={chartImageUrl}
        />
      )}
    </div>
  );

}

export default EditSaveButtons;