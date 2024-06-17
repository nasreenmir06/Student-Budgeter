# student-budgeter

This is a React app also made with Bootstrap, Flask, and HTML. The purpose of this app is to collect a student's financial data and display an informative chart of the student's finances, along with providing them some useful suggestions regarding their finances and direct them to resources that they could consult to make more informative spending/saving decisions.

## Requirements:
- Python v3.11
- nvm v16
- npm v10.7
- node v20.14.0
- React
- Flask
- React-Bootstrap
- Chart JS
- OpenAI
- axios

I have unsuccessfully spent several hours attempting to get this site up and running on Github Pages. However, it still works just fine locally. Here are some instructions on how to load the app locally:
- Be sure you have the correct versions of Python, nvm, npm and node installed. You will need to install the latest versions of React and Flask too. 
- Create a new React app via terminal. You may have to install React first.
- Within this directory, install react-bootstrap, chartjs, openai, and axios via terminal.
- Use the files in this repo to replace the default files. (Do not add the files in "misc" yet)
- If you would like the API part of the app to work, be sure to add your OpenAI API key to server.py.
- Open terminal, switch to the project directory, and run "npm start". 

### If the site doesn't display on localhost:3000, then try the instructions below. There is no guarantee that these instructions will fix the issue, but they're worth a try!
- Add .babelrc and .env from the "misc" folder to the main project directory.
- Copy and paste the code in "zprofile" into a ~/.bashrc, ~/.zshrc, ~/.profile, or ~/.zprofile, depending on which shell you use. Then source this file using "source ___" in terminal.

As of 6/17/2024, the code is not yet finished, so you may notice that the site does not fully utilize Bootstrap yet. I am currently tackling those issues. I will update the code as I go.
