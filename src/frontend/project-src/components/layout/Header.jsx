import React from 'react';
// imports the website logo from our assets folder
import websiteLogo from '../../assets/websitelogo.png';

// our main header component that includes the website name and logo
function Header() {
return (
  <header className="bg-white px-8 py-2 mt-auto">
     {/* links the header to the home page */}
     <a href="/" className="flex items-center justify-start space-x-3">
       {/* displays the website logo on the top left of the header */}
       <img src={websiteLogo} alt="Website Logo" className="h-8 w-auto" />
       {/* displays the website name next to the logo */}
       <h3 className="text-blue-600">EasyChart</h3>
     </a>
  </header>
);
}

export default Header;
