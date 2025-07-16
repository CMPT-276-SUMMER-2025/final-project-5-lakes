import React from 'react';
import { CloudUpload, Clipboard, ChevronRight } from 'lucide-react';
import { Stepper } from '../styling/stepper.jsx';


function App() {
  return (
   <div>
    <p>this is page 1</p>
    <Stepper totalSteps={4} />
   </div>
  );
}

export default App;

