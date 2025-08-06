import { useState } from 'react';
import { useEffect } from 'react';
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
  const navigate = useNavigate();
  const { isAlertVisible, alertConfig, showAlert, hideAlert } = useDefaultError();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    }, [files]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if ((!text || text.trim() === '') && (!files || files.length === 0)) {
      showAlert(
        'error',
        'Missing Input',
        'Please either upload a file or enter your text before proceeding.',
        'Okay'
      );
      return;
    }

    const formData = new FormData();
    formData.append('text', text);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    setIsLoading(true);

    fetch(apiUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
     .then(async (response) => { //// to go to the next page if successful
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.error || 'Something went wrong');
        error.code = data.code || '';
        throw error;
      }
      return data;
    })
    .then((data) => {
      if (data && data.parsedData && data.file) {
        navigate('/edit-data', { state: data, replace: true });
      } else {
        const error = new Error(data.error || 'Something went wrong');
        error.code = data.code || '';
        throw error;
      }
    })
    .catch((error) => {
      if (error.code === 'NO_DATA_EXTRACTED') {
        showAlert(
          'error',
          'Extraction Failed',
          `We could not parse the file: ${error.message}.`,
          'Okay',
          () => navigate('/')
        )
      } else {
        showAlert(
          'error',
          'Submission Error',
          `We could not parse the file: ${error.message}. Please try again later.`,
          'Okay',
          () => navigate('/')
        )
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleGlobalDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleGlobalDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
   <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter"
   onDragOver={handleGlobalDragOver} 
      onDrop={handleGlobalDrop}   >
      <LoadingPopUp show={isLoading} />

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

     <header className="text-center mb-10">
       <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
         Welcome to <span className="text-blue-600">EasyChart!</span>
       </h1>
       <p className="text-lg md:text-xl text-gray-600 mb-6">
         To get started, upload your file or simply write your information below.
       </p>
       <ProgressStepper currentStep="Upload Data" />
     </header>

      <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <FileUploadArea files={files} setFiles={setFiles} showAlert={showAlert} text={text}/>
          <TextInputArea text={text} setText={setText} files={files} showAlert={showAlert}/>
          
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

