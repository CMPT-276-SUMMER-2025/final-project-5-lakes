// TextInputArea: Allows user to type or paste input manually (disables if file is uploaded)

import { Clipboard } from 'lucide-react';

function TextInputArea({ text, setText, files, showAlert }) {

  // Handle text area changes: update state and localStorage
  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    localStorage.setItem('userInput', newText); // Optional: persist input
  };

  // Prevent typing if a file is already uploaded
  const handleFocus = () => {
    if (files.length > 0) {
      showAlert(
        'error',
        'Cannot Enter Text',
        'You already uploaded a file. If you want to input text instead, please remove your file.',
        'Okay'
      );
    }
  };

  const isDisabled = files.length > 0;

  return (
    // Container with dashed border; faded if disabled
    <div className={`dashed-blue-outline ${isDisabled ? 'opacity-50' : ''}`}>
      
      {/* Icon */}
      <Clipboard className="w-16 h-16 text-black-600 mb-6" />

      {/* Description text */}
      <p className="text-gray-600 font-sans text-lg mb-4">
        Paste or type your information below
      </p>

      {/* Main text input */}
      <textarea
        placeholder="Start typing..."
        className="text-box-outline"
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onClick={handleFocus}
        name="text"
        readOnly={isDisabled}
      ></textarea>

    </div>
  );
}

export default TextInputArea;