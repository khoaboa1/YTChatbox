#  YTChatbox

**YTChatbox** is a Chrome extension that lets you ask questions about any YouTube video and get AI-generated answers based on the transcript. It uses OpenAI's ChatGPT model and supports both personal and fallback API keys via a local Flask backend.

---

##  Features

-  Messenger-style chat UI
-  Context-aware answers from video transcript
-  Option to use your own OpenAI API key
-  Local Python Flask backend for fast processing

---

##  How It Works

1. The extension detects and extracts the YouTube video transcript.
2. When you ask a question, it sends the transcript + question to your local backend.
3. The backend uses the OpenAI API to generate an answer based on the context.

---

##  Getting Started

###  Prerequisites

- Python 3.7+
- Google Chrome
- OpenAI account (optional)

---

##  Backend Setup (Flask Server)

### 1. Clone the repository

```bash
git clone https://github.com/khoaboa1/YTChatbox.git
```

### 2. Navigate to the project folder

```bash
cd YTChatbox
```

### 3. Create and activate a virtual environment

#### macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Flask server

```bash
python server.py
```

> Server will run at: `http://localhost:3001`

---

##  Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `/extension` folder from this project
5. Open any YouTube video and click the extension icon to start chatting
---

