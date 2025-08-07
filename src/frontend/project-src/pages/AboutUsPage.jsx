import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import teamPhoto from "../assets/about-pictures/team-picture.png";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-inter">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-14 text-gray-800">About EasyChart</h1>

      {/* Description Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        {/* What is EasyChart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">What is EasyChart?</h2>
          <p className="text-gray-700 text-md leading-relaxed">
            EasyChart is a web application designed to simplify the process of turning data into
            visual stories. Whether you're working with PDFs, spreadsheets, or raw text, we help you
            generate clean, clear charts that are easy to customize and ready to share.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">Our Mission</h2>
          <p className="text-gray-700 text-md leading-relaxed">
            Our mission is to make data visualization accessible to everyone—no technical background
            required. We believe that good visuals help people communicate better, and our goal is
            to eliminate the complexity behind chart creation so that anyone can tell their story
            with data.
          </p>
        </div>

        {/* Who We Help */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">Who We Help</h2>
          <p className="text-gray-700 text-md leading-relaxed">
            EasyChart is built for students, educators, professionals, and anyone who needs to
            quickly turn information into visuals. Whether it's for a class project, team meeting,
            or research presentation, we're here to help you make charts that speak for themselves.
          </p>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <img
          src={teamPhoto}
          alt="Our Team"
          className="rounded-xl shadow-md w-full h-auto mb-6 object-cover"
        />
        <p className="text-gray-700 text-base leading-relaxed">
          We’re a team of passionate student developers and designers who created EasyChart as part
          of a university project. Our diverse skill sets in frontend, backend, and UI/UX design
          came together to solve a simple but important problem: making data visualization easier
          for everyone. From brainstorming to deployment, we’ve worked collaboratively to build a
          tool that empowers users to focus on their message, not the software.
        </p>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle size={24} className="mr-2" />
          Create a Chart
        </Link>
      </div>
    </div>
  );
}

export default AboutUs;