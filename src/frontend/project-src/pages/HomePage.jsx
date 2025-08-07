// This is page 1 where users can upload files or input text data
// It handles form submission and communicates with the backend API
// On successful submission, it navigates to the EditData page with the parsed data

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import TextInputArea from '../components/homepage/TextInputArea';
import FileUploadArea from '../components/homepage/FileUploadArea';
import DefaultError from '../components/messages/DefaultError';
import useDefaultError from '../hooks/DefaultErrorHook';
import LoadingPopUp from '../components/homepage/LoadingPopUp';
import ProgressStepper from '../components/layout/ProgressStepper';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/file-submit`;

function HomePage() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { isAlertVisible, alertConfig, showAlert, hideAlert } = useDefaultError();

  useEffect(() => {
  }, [files]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if ((!text || text.trim() === '') && (!files || files.length === 0)) {
      showAlert('error', 'Missing Input', 'Please either upload a file or enter your text before proceeding.', 'Okay');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('text', text);
    files.forEach(file => formData.append('files', file));

    setIsLoading(true);

    // Submit to backend
    fetch(apiUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = new Error(data.error || 'Something went wrong');
          error.code = data.code || '';
          error.status = response.status || 500;
          throw error;
        }
        return data;
      })
      .then((data) => {
        // Navigate to next page with parsed data
        if (data?.parsedData && data?.edittedData && data?.file) {
          navigate('/edit-data', { state: data, replace: true });
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      })
      .catch((error) => {
        // Handle specific backend errors
        if (error.code === 'NO_DATA_EXTRACTED') {
          showAlert('error', 'Extraction Failed', `We could not parse the file: ${error.message}`, 'Okay', () => navigate('/'));
        } else if (error.status === 410) {
          showAlert('error', 'Submission Error', `We could not parse the file: ${error.message} Please upload a different file.`, 'Okay', () => navigate('/'));
        } else {
          showAlert('error', 'Submission Error', `We could not parse the file: ${error.message} Please try again later.`, 'Okay', () => navigate('/'));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Prevent unwanted browser behaviors when dragging/dropping outside upload area
  const handleGlobalDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleGlobalDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter"
      onDragOver={handleGlobalDragOver}
      onDrop={handleGlobalDrop}
    >
      {/* Loader overlay */}
      <LoadingPopUp show={isLoading} />

      {/* Alert modal */}
      {isAlertVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DefaultError
            title={alertConfig.title}
            message={alertConfig.message}
            buttonText={alertConfig.buttonText}
            onButtonClick={hideAlert}
            isVisible={isAlertVisible}
          />
        </div>
      )}

      {/* Header section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-blue-600">EasyChart!</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          To get started, upload your file or simply write your information below.
        </p>
        <ProgressStepper currentStep="Upload Data" />
      </header>

      {/* Main form section */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {/* File uploader */}
        <FileUploadArea files={files} setFiles={setFiles} showAlert={showAlert} text={text} />
        
        {/* Text input */}
        <TextInputArea text={text} setText={setText} files={files} showAlert={showAlert} />

        {/* Submit button */}
        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            Go to the next step
            <ChevronRight size={25} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default HomePage;