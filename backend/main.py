from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

from engine import ChronosEngine

app = FastAPI(title="CHRONOS-BHARAT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ChronosEngine()


@app.get("/health")
async def health():
    return {"status": "ok", "engine": "CHRONOS-BHARAT v1.0"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Score the transaction using ChronosEngine
            result = engine.evaluate(payload)
            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
