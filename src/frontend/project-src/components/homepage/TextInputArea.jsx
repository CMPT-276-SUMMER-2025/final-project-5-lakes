import { Clipboard } from 'lucide-react';


function TextInputArea() {
 return (
   <div className="dashed-blue-outline">
     <Clipboard className="w-16 h-16 text-black-600 mb-6" />

     <p className="text-gray-600 font-sans text-lg mb-4">
        Paste or type your information below
    </p>

     <textarea
       placeholder="Start typing..."
       className="text-box-outline"
     ></textarea>

   </div>
 );
}


export default TextInputArea;