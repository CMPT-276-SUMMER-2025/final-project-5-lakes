import React from "react";
// import TonyImg from '../../assets/team/tony.jpg';
// import ShelbyImg from '../../assets/team/shelby.jpg';
// import NickImg from '../../assets/team/nick.jpg';
// import JavierImg from '../../assets/team/javier.jpg';

// UPLOAD IMAGES ABOVE IN THE RIGHT DIRECTORY AND UNCOMMENT THE IMPORTS

const teamMembers = [
  {
    name: "Shelby Haines",
    role: "Main role(s) here",
    bio: "Short bio or contribution summary.",
    // img: TonyImg
  },
  {
    name: "Tony Wu",
    role: "Main role(s) here",
    bio: "Short bio or contribution summary.",
    // img: ShelbyImg
  },
  {
    name: "Nick Lei",
    role: "Main role(s) here",
    bio: "Short bio or contribution summary.",
    // img: NickImg
  },
  {
    name: "Javier Deng Xu",
    role: "Main role(s) here",
    bio: "Short bio or contribution summary.",
    // img: JavierImg
  },
];

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-10">Meet the EasyChart Team!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center"
          >
            {/* <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mb-4"
            /> */}
            <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
            <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;