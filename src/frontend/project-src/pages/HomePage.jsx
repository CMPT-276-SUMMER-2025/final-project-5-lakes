// import { Link } from 'react-router-dom';


function HomePage() {
  return (
   <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">

     <header className="text-center mb-10">
       <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
         Welcome to <span className="text-blue-600">EasyChart!</span>
       </h1>
       <p className="text-lg md:text-xl text-gray-600">
         To get started, upload your file or simply write your information below.
       </p>
     </header>
     
   </div>

  );
}

export default HomePage;

