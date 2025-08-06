[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19702202&assignment_repo_type=AssignmentRepo)


**Project Title:**
EasyChart

**Group Members:**
Nick Ze Kun Lei, Javier Deng Xu, Shelby Haines, Tony Junxiang Wu

# Brief Description of Project
EasyChart is a website that provides a simple way for users to visualize data, without having to learn complex tools. Users can upload data in various formats, and the platform will automatically generate relevant visualizations such as charts and graphs. These visuals can then be edited and exported in various formats.

# Links
**Project website link:** easychart-omega.vercel.app  
**Project Report link:**  
**Project  M1 video link:** [M1 Group 5 Video](https://www.google.com/url?q=https://drive.google.com/file/d/1T4y1QCeSbcONjlZ-4wep66cwlItRHwUW/view&sa=D&source=editors&ust=1754398172556768&usg=AOvVaw3dkA3paY9PeDAzT2hVgkcb)    
**Project  M2 video link:**

# Folder Structure
This project is organized into directories for documentation, source code, and dependencies:

- `docs/`: Contains project-related documents including our AI disclosure forms.   
- `src/`: The main source code folder, split into:  
  - `backend/`: Backend server code, APIs, and related utilities and tests.  
  - `frontend/`: Frontend assets including the main HTML, configuration, React components, pages, styles, and utilities.  
- Root files: Configuration and metadata such as `package.json` and lock files.

Below is a simplified overview of our folder structure:
```bash
final-project-5-lakes/
├── README.md
├── docs/
│   └── ai-disclosure/
├── src/
│   ├── backend/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── deepSeek/
│   │   ├── quickChart/
│   │   ├── uploads/
│   │   └── __tests__/
│   └── frontend/
│       ├── index.html
│       ├── vite.config.js
│       ├── project-src/
│       │   ├── App.jsx
│       │   ├── assets/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       └── public/
├── package.json
└── package-lock.json
```

# Steps to Deploy the Site Locally
1. Clone the repository onto your local machine, and make sure you have Node.js installed.
2. In the backend folder (`final-project-5-lakes/src/backend`), create a file called `.env` and paste the OPENROUTER API in this file.
3. In the frontend folder (`final-project-5-lakes/src/frontend`), create a file called `.env` and paste the base URL for vite in this file.
4. Open a terminal, and navigate to the `frontend` folder (`final-project-5-lakes/src/frontend`). Then enter `npm install --legacy-peer-deps` and wait for it to install.
5. Open a different (new) terminal, and navigate to the `backend` folder (`final-project-5-lakes/src/backend`). Run `npm install` and wait for it to install. Then enter `node server.js`, it should say the server is running.
6. Lastly, in the terminal where you are in the frontend (`final-project-5-lakes/src/frontend`), run `npm run dev`. Click on the link that is provided to you (it should look like "http://localhost:5173") and view the website through your browser.

# Known Issues and Limitations
- Occasionally, the DeepSeek API doesn’t work properly, and users may see an error message. When this happens, users can simply dismiss the error and try again.
- The DeepSeek API can sometimes take a long time to respond, leading to delays in loading results.
- Users need to navigate between pages using the buttons provided on the page. Using their browser navigation buttons can sometimes cause unexpected behaviour.   
_To find a record of all our current and fixed bugs, you can filter through our tickets using the 'bug' label._

# Technologies Used
- React (frontend)  
- Node.js (backend)  
- QuickChart API for chart rendering  
- DeepSeek API for data analysis  
- Tailwind CSS for styling  