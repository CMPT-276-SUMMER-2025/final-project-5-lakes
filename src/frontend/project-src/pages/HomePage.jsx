import TextInputArea from '../components/homepage/TextInputArea';
import FileUploadArea from '../components/homepage/FileUploadArea';
import HomeStepper from '../components/homepage/HomeStepper';
//import { Link } from 'react-router-dom';
import { ChevronRight, CircleChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
        console.log('[HomePage] Files state updated:', Array.from(files));
    }, [files]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('text', text);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    console.log('testing inputs:');
    console.log('Text input:', text);
    console.log("Files:", Array.from(files));



    // replace with real backend
    /***************************/
    fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // to got to the next page if successful
     .then((response) => {
      if (!response.ok) {
        throw new Error('error sending info');
      }
      return response.text();
    })
    .then((data) => {
      navigate('/data-confirm');
    })
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

     <header className="text-center mb-10">
       <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
         Welcome to <span className="text-blue-600">EasyChart!</span>
       </h1>
       <p className="text-lg md:text-xl text-gray-600 mb-6">
         To get started, upload your file or simply write your information below.
       </p>
       <HomeStepper />
     </header>


    <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <FileUploadArea files={files} setFiles={setFiles} />
        <TextInputArea text={text} setText={setText} />
        
        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
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

