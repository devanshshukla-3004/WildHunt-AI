# WildHunt-AI in GitHub Codespaces

This repository includes a Dev Container configuration for a repeatable cloud development environment.

## Included customization

- Node.js 22 development container
- ESLint and Prettier VS Code extensions
- Format-on-save and two-space indentation
- Automatic forwarding notification for Vite on port 5173
- Dependency installation when the Codespace is created

## Start the app

Open the repository in GitHub Codespaces, then run:

```bash
npm run dev -- --host 0.0.0.0
```

When Codespaces prompts about port 5173, open the forwarded port to preview the app.

## Validate changes

```bash
npm run typecheck
npm run test:run
npm run build
```

If the project uses local Ollama inference, remember that Ollama must be running on a machine reachable by the app; a cloud Codespace does not automatically have access to Ollama installed on your personal computer.
