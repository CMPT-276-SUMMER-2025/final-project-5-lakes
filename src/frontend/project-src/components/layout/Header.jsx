import websiteLogo from '../../assets/websitelogo.png';
import { Link } from 'react-router-dom';

// our main header component that includes the website name and logo
function Header() {
return (
  <header className="bg-white px-8 py-2 flex items-center justify-between shadow-sm">

     <Link to="/" className="flex items-center space-x-2">
        <img
          src={websiteLogo}
          alt="Website Logo"
          className="h-6 w-auto align-middle"
        />
        <span className="text-blue-600 text-2xl font-semibold align-middle">EasyChart</span>
      </Link>

     <nav className="space-x-5 text-md">
        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
        <Link to="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
        <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</Link>
      </nav>

  </header>
);
}

export default Header;
