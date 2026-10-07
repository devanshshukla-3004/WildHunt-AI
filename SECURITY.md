# Security

## Reporting

Please report security issues privately to the repository owner rather than opening a public issue with sensitive details.

## Design notes

WildHunt intentionally avoids hosted AI credentials and a WildHunt image-upload backend in the MVP.

Images are processed in the browser and sent to the configured Ollama endpoint for verification. Do not point the application at an untrusted remote endpoint unless you understand its privacy implications.

Never commit API keys, credentials, private images, or local environment files.
