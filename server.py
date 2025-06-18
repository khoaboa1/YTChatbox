from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
from dotenv import load_dotenv
import os
import re

# Load fallback API key from .env
load_dotenv()
FALLBACK_API_KEY = os.getenv("OPENAI_API_KEY")

# Flask app
app = Flask(__name__)
CORS(app)

# Extract YouTube video ID
def extract_video_id(url):
    match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", url)
    return match.group(1) if match else None

@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.get_json()
    url = data.get("url", "")
    question = data.get("question", "")
    max_time = data.get("time", 0)
    title = data.get("title", "Unknown Title")
    user_api_key = data.get("user_api_key", "").strip()

    video_id = extract_video_id(url)
    if not video_id or not question:
        return jsonify({"error": "Missing video ID or question"}), 400

    # Fetch transcript
    try:
        transcript_data = YouTubeTranscriptApi().fetch(video_id)
        context_window = 150
        start_time = max(0, max_time - context_window)

        filtered_lines = [
            f"[{item.start:.2f}s] {item.text}"
            for item in transcript_data
            if start_time <= item.start <= max_time
        ]

        max_chars = 8000
        transcript = ""
        for line in filtered_lines:
            if len(transcript) + len(line) > max_chars:
                break
            transcript += line + "\n"
    except Exception as e:
        return jsonify({"error": f"Transcript error: {str(e)}"}), 500

    # Use provided key if available, otherwise fallback
    api_key_to_use = user_api_key if user_api_key else FALLBACK_API_KEY
    client = OpenAI(api_key=api_key_to_use)

    # Generate answer
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful assistant answering questions about a YouTube video titled: '{title}'. Use the transcript and timestamps provided to answer as clearly and contextually as possible."
                },
                {
                    "role": "user",
                    "content": f"Transcript (last {context_window} seconds):\n{transcript}\n\nQuestion:\n{question}"
                }
            ]
        )
        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"OpenAI error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=3001)
