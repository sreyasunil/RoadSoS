print("NEW MAIN.PY LOADED")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

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

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "RoadSoS Backend Running"}

@app.post("/chat")
def chat(data: ChatRequest):
    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=data.message
        )
        return {"reply": response.text}
    except Exception as e:
        print("ERROR:", e)
        raise