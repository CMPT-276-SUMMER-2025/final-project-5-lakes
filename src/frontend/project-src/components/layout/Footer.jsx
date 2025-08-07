// This component renders the footer of the application with links to About Us and FAQs

import { Link } from 'react-router-dom';

function Footer() {
  return (
    // Footer container with styling
    <footer className="bg-white text-gray-800 p-4 text-center text-sm mt-auto">
      <div className="flex justify-center items-center space-x-4">
          
        {/* Copyright */}
        <span>&copy; {2025} EasyChart.</span>

        {/* Divider */}
        <span>|</span>

        {/* Link to About Us page */}
        <Link to="/about-us" className="underline hover:text-blue-600">
          About Us
        </Link>

        <span>|</span>

        {/* Link to FAQ page */}
        <Link to="/faq" className="underline hover:text-blue-600">
          FAQs
        </Link>
      </div>
    </footer>
  );
}

export default Footer;