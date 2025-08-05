import { Clipboard } from 'lucide-react';
//import { useState } from 'react';



function TextInputArea({ text, setText, files, showAlert}) {
  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText); 
    localStorage.setItem('userInput', newText); 
  };

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
   <div className={`dashed-blue-outline ${isDisabled ? 'opacity-50' : ''}`}>
     <Clipboard className="w-16 h-16 text-black-600 mb-6" />

     <p className="text-gray-600 font-sans text-lg mb-4">
        Paste or type your information below
    </p>

     <textarea
       placeholder="Start typing..."
       className="text-box-outline"
       value={text}
      onChange={handleChange}
      onFocus={handleFocus}
      name="text"
     ></textarea>

   </div>
 );
}


export default TextInputArea;