# RoadSoS — AI-Powered Road Emergency Response Assistant

RoadSoS is a web-based emergency response assistant designed to guide users through road accidents during the critical first hour. It combines AI-powered triage, real-time maps, and emergency contacts in a single platform accessible from any browser.

---

## Purpose

Road accidents in India claim over 1.5 lakh lives annually. A significant number of these deaths occur due to delayed response and lack of immediate guidance — not the accident itself. RoadSoS addresses this by providing structured AI triage, nearby emergency services on a live map, first aid guidance, and one-tap emergency contacts — all in one place.

---

## Key Features

- **AI Emergency Chatbot** — Conducts structured triage based on injuries, consciousness, bleeding, fire, and victim count.
- **Conversation Memory** — Retains full conversation context so users do not need to repeat information during a crisis.
- **Real-Time Map** — Locates nearby hospitals, police stations, and fire stations using live GPS and OpenStreetMap data. Includes one-tap navigation.
- **Accident Image Analysis** — Accepts an uploaded or captured photo and returns an AI-generated severity assessment.
- **Emergency Contacts** — Direct access to 108 (Ambulance), 100 (Police), 101 (Fire), and 112 (All Emergencies).
- **First Aid Guide** — Step-by-step offline instructions for severe bleeding, unconscious victims, and vehicle fires.
- **SOS Button** — Single tap activates emergency mode in the AI chat.
- **Multilingual Support** — Responds in English, Malayalam, Hindi, or Tamil based on user input.

---

## Technology Stack

| Layer        | Technology                 |
|--------------|----------------------------|
| Frontend     | React.js                   |
| Backend      | FastAPI (Python)           |
| AI Model     | Google Gemini 2.5 Flash    |
| Map          | Leaflet.js + OpenStreetMap |
| Places Data  | Overpass API               |
| Geolocation  | Browser Geolocation API    |
| AI SDK       | google-genai (Python)      |
| Server       | Uvicorn                    |

---

## Installation and Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- Gemini API key — free at https://aistudio.google.com

### 1. Clone the repository
```bash
git clone https://github.com/sreyasunil/RoadSoS.git
cd RoadSoS
```

### 2. Backend setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install fastapi uvicorn google-genai python-dotenv python-multipart
```

Create a `.env` file inside the `backend` folder:
```
GEMINI_API_KEY=your_api_key_here
```

Start the backend server:
```bash
uvicorn main:app --port 8001
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Usage

1. **AI Chat** — Describe the emergency. The AI will ask triage questions and provide step-by-step guidance.
2. **Map** — Click "Find My Location" to view real nearby hospitals, police stations, and fire stations. Use "Navigate" for directions.
3. **Image** — Upload or capture an accident photo for AI severity analysis.
4. **Emergency** — Access emergency numbers 108, 100, 101, and 112 in one tap.
5. **First Aid** — Follow offline step-by-step first aid instructions.
6. **SOS** — Tap the SOS button to immediately trigger emergency mode.

Note: RoadSoS provides informational guidance only and is not a substitute for professional emergency services. Always call 108 or 112 in a real emergency.

---

## Future Improvements

- **Crash Detection** — Automatic accident detection using phone accelerometer and gyroscope sensors.
- **Auto Family Alerts** — SMS or WhatsApp notifications to emergency contacts with live location on accident detection.
- **Voice Mode** — Hands-free voice input and output for situations where typing is not possible.
- **Hospital Availability** — Real-time data on bed availability and trauma center status.
- **Risk Prediction** — Pre-trip warnings about accident-prone roads and high-risk zones.
- **Offline Mode** — Core functionality without internet using cached maps and local processing.
- **Mobile App** — Native Android/iOS app with crash detection and background location tracking.
- **Government Integration** — Direct API connection to the 112 India emergency dispatch system.

