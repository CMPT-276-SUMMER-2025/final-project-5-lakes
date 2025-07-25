import { Clipboard } from 'lucide-react';
//import { useState } from 'react';



function TextInputArea({ text, setText }) {
  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText); 
    localStorage.setItem('userInput', newText); 
  };

 return (
   <div className="dashed-blue-outline">
     <Clipboard className="w-16 h-16 text-black-600 mb-6" />

     <p className="text-gray-600 font-sans text-lg mb-4">
        Paste or type your information below
    </p>

     <textarea
       placeholder="Start typing..."
       className="text-box-outline"
       value={text}
      onChange={handleChange}
      name="text"
     ></textarea>

   </div>
 );
}


export default TextInputArea;