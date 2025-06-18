# YTChatbox
Ask questions about any YouTube video and get AI-generated answers based on the video transcript! This Chrome extension uses ChatGPT and supports both personal and default API keys.
## Features:
Chat-style interface 
Contextual answers using recent transcript
Option to use your own OpenAI API key
Local Flask backend for processing
## How It Works
The extension extracts the video transcript.
Sends it (with your question) to the backend server.
The backend uses OpenAI to answer based on transcript context.
## Getting Started

### Prerequisites
Python 3.7+
Google Chrome
OpenAI account (optional if you want to use your own key)
### Backend Setup (Flask Server)
Clone the repository:
git clone https://github.com/your-username/yt-chatbox-extension.git
cd yt-chatbox-extension
Create and activate a virtual environment:
macOS/Linux:
python3 -m venv venv
source venv/bin/activate
Windows:
python -m venv venv
venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Set your OpenAI fallback key in a .env file:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Run the server:
python server.py
The server will run at: http://localhost:3001

### Chrome Extension Setup
Open Chrome and go to chrome://extensions
Enable Developer Mode
Click Load unpacked and select the /extension folder
Click the extension icon on a YouTube video page to open the chat
