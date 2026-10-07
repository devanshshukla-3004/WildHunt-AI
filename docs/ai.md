# WildHunt Local AI

WildHunt uses Ollama as its local inference runtime. The browser talks directly to the user's local Ollama HTTP API; WildHunt does not require a hosted AI API.

## Default model

`granite3.2-vision`

Install:

```powershell
ollama pull granite3.2-vision
```

Check:

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

The app calls `POST /api/chat` with a mission-specific prompt and a base64 image. The response is requested as JSON, normalized, and validated with Zod.

## Configuration

Copy `.env.example` to `.env.local`.

If the browser cannot reach Ollama while PowerShell can, check the local Ollama CORS/origin configuration.
