import { Link } from 'react-router-dom';

function Footer() {

return (
  <footer className="bg-white text-gray-800 p-4 text-center text-sm mt-auto">
    <div className="flex justify-center items-center space-x-4">

      <span>&copy; {2025} EasyChart. </span>

      <span>|</span>

        <Link to="/faq" className="underline hover:text-blue-600">
          FAQs
        </Link>
      </div>
  </footer>
);
}

export default Footer;