from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DeepSeek Coder Chat API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for chat request
class ChatRequest(BaseModel):
    message: str
    system_prompt: Optional[str] = "You are DeepSeek Coder, an intelligent coding assistant."
    temperature: Optional[float] = 0.7

# Model for chat response
class ChatResponse(BaseModel):
    response: str

# Ollama API client
class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "deepseek-coder-v2:16b"
        self.client = httpx.AsyncClient(timeout=120.0)  # 2 minute timeout
    
    async def generate_chat_response(self, message: str, system_prompt: str, temperature: float) -> str:
        try:
            url = f"{self.base_url}/api/chat"
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "stream": False,
                "temperature": temperature
            }
            
            logger.info(f"Sending request to Ollama: {payload}")
            response = await self.client.post(url, json=payload)
            
            if response.status_code != 200:
                logger.error(f"Ollama API error: {response.status_code} {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Error from Ollama API")
            
            response_data = response.json()
            logger.info("Received response from Ollama")
            return response_data["message"]["content"]
            
        except httpx.RequestError as e:
            logger.error(f"Request error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"Error communicating with Ollama: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Create Ollama client
ollama_client = OllamaClient()

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "DeepSeek Coder Chat API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response_text = await ollama_client.generate_chat_response(
            message=request.message,
            system_prompt=request.system_prompt,
            temperature=request.temperature
        )
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)