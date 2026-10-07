# Contributing

Thanks for contributing to WildHunt AI.

## Local development

1. Install Node.js and Ollama.
2. Install the vision model: `ollama pull granite3.2-vision`
3. Install dependencies: `npm install`
4. Run `npm run typecheck`, `npm test -- --run`, and `npm run build`.
5. Start with `npm run dev`.

## Contribution principles

- Keep AI local-first where practical.
- Do not add telemetry or unnecessary personal-data collection.
- Keep photos out of hosted application storage.
- Design missions around safe observation rather than risky activity.
- Keep TypeScript strict and code easy to review.
- Add or update tests when changing core behavior.

Please open an issue before large architectural changes.
