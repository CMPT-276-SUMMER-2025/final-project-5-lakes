import TextInputArea from '../components/homepage/TextInputArea';
import FileUploadArea from '../components/homepage/FileUploadArea';
import HomeStepper from '../components/homepage/HomeStepper';
import { Link } from 'react-router-dom';
import { ChevronRight, CircleChevronRight } from 'lucide-react';


function HomePage() {
  return (
   <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">

     <header className="text-center mb-10">
       <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
         Welcome to <span className="text-blue-600">EasyChart!</span>
       </h1>
       <p className="text-lg md:text-xl text-gray-600 mb-6">
         To get started, upload your file or simply write your information below.
       </p>
       <HomeStepper />
     </header>

    <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
       <FileUploadArea />
       <TextInputArea />
    </div>

    <Link to="/data-confirm">
    <button className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100">
       Go to the next step
       <ChevronRight size={25} className="ml-2" />
    </button>
    </Link>

   </div>

  );
}

export default HomePage;

