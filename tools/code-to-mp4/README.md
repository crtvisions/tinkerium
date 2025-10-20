# Code-to-MP4

Transform HTML, CSS, and JavaScript animations into MP4 videos with AI-powered code generation.

## Features

- **AI Code Generation**: Generate animated scenes from text prompts using multiple style presets
- **Live Preview**: Real-time code editing with instant visual feedback
- **Video Export**: Record animations as MP4 files with MediaRecorder API
- **Custom Filters**: Apply visual effects (brightness, contrast, saturation, etc.)
- **Multiple Editors**: Switch between combined or split (HTML/CSS/JS) editing modes
- **Animation Controls**: Adjust duration, FPS, and playback settings

## Tech Stack

- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- MediaRecorder API for video recording
- OpenRouter API for AI code generation

## Usage

### Manual Code Entry

1. Write or paste your HTML, CSS, and JavaScript in the code editor
2. Preview the animation in real-time
3. Adjust video settings (duration, FPS, filters)
4. Click "Record MP4" to export

### AI-Powered Generation

1. Go to the "AI Assistant" tab
2. Enter a simple prompt describing what you want (e.g., "A cat in a hat retro style")
3. Click "✨ Generate Animation"
4. Preview the generated animation
5. Click "Apply" to load it into the editor
6. Edit as needed, then record and download

## AI Assistant Features

The AI assistant uses a single, robust animation generator that:
- Creates impressive, working animations from simple prompts
- Supports Three.js and Anime.js for advanced effects
- Adapts the visual style to match your prompt
- Always generates browser-ready HTML, CSS, and JavaScript
- Works on 960x540 canvas size for optimal quality

## Development

This tool runs as part of the Tinkerium monorepo. See the root README for setup instructions.
