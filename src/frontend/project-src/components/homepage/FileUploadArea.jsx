import { CloudUpload } from 'lucide-react';


function FileUploadArea() {
 return (
   <div className="dashed-blue-outline">

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