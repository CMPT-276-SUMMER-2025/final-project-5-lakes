import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Shelby Haines",
    role: "Project Manager, Frontend Developer",
    bio: "Short bio or contribution summary.",
  },
  {
    name: "Tony Wu",
    role: "Frontend Developer, UI Designer",
    bio: "Short bio or contribution summary.",
  },
  {
    name: "Nick Lei",
    role: "Backend Developer, API Integration",
    bio: "Short bio or contribution summary.",
  },
  {
    name: "Javier Deng Xu",
    role: "Backend Developer, API Integration",
    bio: "Short bio or contribution summary.",
  },
];

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-14">About EasyChart</h1>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        {/* About EasyChart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">What is EasyChart?</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            EasyChart is a web app that helps you create professional data visualizations instantly.
            Just upload a file—PDF, DOCX, Excel—and we’ll auto-generate charts you can customize
            and export. No Excel skills, no steep learning curve—just clean, clear visuals.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">Our Mission</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Our goal is to break down the barriers to effective data visualization. We want to give
            students, educators, and professionals a fast, accessible way to turn complex data into
            meaningful, presentation-ready visuals.
          </p>
        </div>

        {/* Who We Built This For */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600 text-center">Who We Help</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Whether you're a student rushing to finish a project, a teacher building worksheets,
            or a manager preparing a report—EasyChart gives you clear, customizable charts without
            the tech headache.
          </p>
        </div>
      </div>

      {/* Meet the Team Section */}
      <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 mt-12 text-lg font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle size={24} className="mr-2" />
          Create a Chart
        </Link>
      </div>
    </div>
  );
}

export default AboutUs;