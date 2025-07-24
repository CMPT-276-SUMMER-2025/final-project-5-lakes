import { CloudUpload, Paperclip } from 'lucide-react';
import { useState } from 'react';

function FileUploadArea() {

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    // "files" is a FileList object for accessing the files
    const files = event.dataTransfer.files;

    // you could write how the files should be handled here
    // we could maybe verify some things here (like check to make
    // sure it is one of the types we accept) and then you could
    // save it or upload it where needed
  };
  

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  if (isDragOver) {
    return (
      <div
        className="border-2 border-blue-500 bg-blue-50 flex flex-col items-center justify-center p-8 rounded-lg text-center transition-colors duration-200 ease-in-out"
        {...dragHandlers}
      >
        <Paperclip className="w-12 h-12 text-black mb-4" />
        <p className="text-black text-lg mb-4 font-sans mb-2">
          Drop files here
        </p>
      </div>
    );
  }

 return (
   <div className="dashed-blue-outline" {...dragHandlers}>

     <CloudUpload className="w-16 h-16 text-black-600 mb-6" />

     <button className="white-base-button">
       Choose file to upload
     </button>

     <p className="text-gray-600 text-lg mb-4 font-sans mb-2">
        Or drag and drop it here
    </p>

     <p className="text-sm text-gray-400">
       Accepted formats: PDF, DOC, XLS, CSV, JPEG, PNG
     </p>
     
   </div>
 );
}


export default FileUploadArea;