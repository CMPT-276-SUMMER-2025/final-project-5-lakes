[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19702202&assignment_repo_type=AssignmentRepo)


**Project Title:**
EasyChart

**Group Members:**
Nick Ze Kun Lei, Javier Deng Xu, Shelby Haines, Tony Junxiang Wu

# Brief Description of Project
A website that provides a simple way for users to visualize data, without having to learn complex tools. Users can upload data in various formats, and the platform will automatically generate relevant visualizations such as charts and graphs. These visuals can then be exported in various formats.

**Brief Description of API changes from Milestone 0**
---
In milestone 0, our team mentioned to use the OpenAI API for chart analysis, NLQ parsing, and smart selection. However, during our process in working on milestone 1, we figured that the OpenAI API did not offer a free tier. To compensate, we will be changing our API to DeepSeek's free APIs (Using OpenRouter, which allows free access to DeepSeek V3 0324) while maintaining identical features.

# Links
**Project website link:** easychart-omega.vercel.app  
**Project Report link:**  
**Project video link:**  


# Folder Structure
This project is organized into directories for documentation, source code, and tools:

- `docs/`: Contains project-related documents including our AI disclosure forms.   
- `src/`: The main source code folder, split into:  
  - `backend/`: Backend server code, APIs, and related utilities and tests.  
  - `frontend/`: Frontend assets including the main HTML, configuration, React components, pages, styles, and utilities.  
- Root files: Configuration and metadata such as `package.json` and lock files.

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
│   │   ├── prompts/
│   │   ├── uploads/
│   │   └── __tests__/
│   └── frontend/
│       ├── index.html
│       ├── vite.config.js
│       ├── project-src/
│       │   ├── App.jsx
│       │   ├── components/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       └── public/
├── tools/
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