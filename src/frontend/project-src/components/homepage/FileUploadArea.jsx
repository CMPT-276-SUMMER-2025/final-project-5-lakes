// Handles file uploads via drag-and-drop or button click, with validation

import { CloudUpload, Paperclip, CheckCircle } from 'lucide-react';
import { useState } from 'react';

function FileUploadArea({ setFiles, files, showAlert, text }) {
  const [isDragOver, setIsDragOver] = useState(false); 
  const [hasUploaded, setHasUploaded] = useState(files.length > 0); 

  const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  const MAX_FILE_SIZE_KB = 100;

  // Validates file type, size, and whether text input is already present
  const handleValidateFiles = (newFiles) => {
    if (text.trim() !== '') {
      setIsDragOver(false);
      showAlert(
        'error',
        'Cannot Upload File',
        'You have already entered text. If you want to upload a file instead, please clear your text input.',
        'Okay'
      );
      return [];
    }

    const validFiles = [];
    const invalidFileNames = [];
    const invalidFileSize = [];

    newFiles.forEach((file) => {
      const fileSizeKB = file.size / 1024;

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        invalidFileNames.push(file.name);
      } else if (fileSizeKB > MAX_FILE_SIZE_KB) {
        invalidFileSize.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFileNames.length > 0) {
      showAlert(
        'error',
        'Unsupported File Type',
        'Please upload PDF, XLSX, DOCX, CSV, or TXT files.',
        'Okay'
      );
    } else if (invalidFileSize.length > 0) {
      showAlert(
        'error',
        'File Too Large',
        'Please upload a file less than 100KB.',
        'Okay'
      );
    }

    return validFiles;
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validatedFiles = handleValidateFiles(droppedFiles);

    if (validatedFiles.length > 0) {
      setFiles(validatedFiles);
      setHasUploaded(true);
    } else {
      setHasUploaded(false);
    }
  };

  // File selection via click-to-upload
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validatedFiles = handleValidateFiles(selectedFiles);

    if (validatedFiles.length > 0) {
      setFiles(validatedFiles);
      setHasUploaded(true);
    } else {
      e.target.value = null;
      setHasUploaded(false);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setHasUploaded(false);
  };

  // Handlers for drag-and-drop events
  const dragHandlers = {
    onDragEnter: text.trim() === '' ? handleDragEnter : (e) => e.preventDefault(),
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  // Uploaded state view
  if (hasUploaded && !isDragOver) {
    return (
      <div className="border-2 border-green-500 bg-green-50 flex flex-col items-center justify-center p-8 rounded-lg text-center transition-colors duration-200 ease-in-out" {...dragHandlers}>
        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
        <p className="text-green-500 text-lg font-semibold mb-4">
          <span>'{files[0].name}'</span> uploaded successfully!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label htmlFor="hidden-file-input" className="white-base-button">
            Upload a new file
          </label>
          <button onClick={handleRemoveFile} className="white-base-button">
            Remove current file
          </button>
        </div>

        <input
          type="file"
          name="files"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          id="hidden-file-input"
          accept={ACCEPTED_FILE_TYPES.join(',')}
        />

        <p className="text-gray-600 text-lg mb-4 font-sans mb-2">
          Or drag and drop a new one
        </p>
      </div>
    );
  }

  // Dragging over state view
  if (isDragOver) {
    return (
      <div className="border-2 border-blue-500 bg-blue-50 flex flex-col items-center justify-center p-8 rounded-lg text-center transition-colors duration-200 ease-in-out" {...dragHandlers}>
        <Paperclip className="w-12 h-12 text-black mb-4" />
        <p className="text-black text-lg mb-4 font-sans mb-2">Drop files here</p>
      </div>
    );
  }

  // Default view (no upload yet)
  const isDisabled = text.trim() !== '';
  return (
    <div className={`dashed-blue-outline ${isDisabled ? 'opacity-50' : ''}`} {...dragHandlers}>
      <CloudUpload className="w-16 h-16 text-black-600 mb-6" />

      <input
        type="file"
        name="files"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        id="hidden-file-input"
        accept={ACCEPTED_FILE_TYPES.join(',')}
      />

      <label htmlFor="hidden-file-input" className="white-base-button">
        Choose file to upload
      </label>

      <p className="text-gray-600 text-lg mb-4 font-sans mb-2">
        Or drag and drop it here
      </p>

      <p className="text-sm text-gray-400">
        Accepted formats: PDF, XLSX, DOCX, CSV, TXT
      </p>
    </div>
  );
}

export default FileUploadArea;