print("NEW MAIN.PY LOADED")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from typing import List
import os
from fastapi import UploadFile, File
from PIL import Image

load_dotenv()
print("KEY FOUND:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM = """You are RoadSoS, an AI road emergency assistant for India. Be calm, fast, life-saving focused.
When user reports accident: ask triage questions — injuries? victim conscious? bleeding? vehicle fire? how many victims?
Assess severity: MINOR / MODERATE / SEVERE (use these exact words).
Recommend: MINOR→clinic, MODERATE→hospital, SEVERE→trauma center + call 108 immediately.
Emergency numbers India: 108=Ambulance, 100=Police, 101=Fire, 112=All.
Respond in user's language (English/Malayalam/Hindi/Tamil).
Always end with: ⚠️ Call 108 or 112 for immediate help."""

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    history: List[Message]
    message: str

@app.get("/")
def home():
    return {"message": "RoadSoS Backend Running"}

@app.post("/chat")
def chat(data: ChatRequest):
    try:
        contents = []
        for m in data.history[-6:]:
            role = "user" if m.role == "user" else "model"
            contents.append({"role": role, "parts": [{"text": m.text}]})
        contents.append({"role": "user", "parts": [{"text": SYSTEM + "\n\n" + data.message}]})

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=contents
        )
        return {"reply": response.text}
    except Exception as e:
        print("ERROR:", e)
        raise

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

    try:

        image = Image.open(file.file)

        prompt = """
You are an accident severity analysis AI.

Analyze this road accident image and provide:

1. Severity:
MINOR / MODERATE / SEVERE

2. Visible injuries

3. Vehicle damage

4. Immediate actions

5. Whether ambulance should be called

Keep response short and structured.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, image]
        )

        return {
            "analysis": response.text
        }

    except Exception as e:
        print("IMAGE ERROR:", e)
        return {
            "analysis": "Unable to analyze image."
        }