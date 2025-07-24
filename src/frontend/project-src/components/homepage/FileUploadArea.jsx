import { CloudUpload, Paperclip } from 'lucide-react';
import { useState } from 'react';

function FileUploadArea({setFiles }) {

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    console.log('[FileUploadArea] Drag enter correct');
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

    
    const droppedFiles = Array.from(event.dataTransfer.files);
    console.log('[FileUploadArea] dropped files:', droppedFiles);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files); 
  console.log("Selected files:", selectedFiles);
  setFiles(selectedFiles);
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

     <input
        type="file"
        name="files"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        id="hidden-file-input"
      />

     <label htmlFor="hidden-file-input" className="white-base-button">
      Choose file to upload
    </label>

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