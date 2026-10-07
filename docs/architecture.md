# Architecture

```text
React/Vite PWA
  ├─ Hunt catalog + safety constraints
  ├─ Camera/file capture
  ├─ Mission-specific verification prompt
  ├─ Local session state
  └─ Ollama provider
        └─ http://127.0.0.1:11434/api/chat
              └─ open-weight vision model
                    └─ structured JSON
                          └─ Zod validation
```

The AI provider is isolated under `src/services/ai/`, keeping the UI independent of the inference implementation. This leaves room for a browser-side ONNX provider later.
