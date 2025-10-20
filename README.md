# Tinkerium

A creative coding playground featuring AI-powered code generation and video rendering tools.

## 🚀 Features

- **Code-to-MP4**: Transform code into animated videos with AI-powered scene generation
- **AI Style Presets**: Multiple aesthetic styles (Tokyo Night Neon, Retro CRT, Minimal Elegance)
- **Real-time Preview**: Live code editing with instant visual feedback
- **Video Export**: Record animations as MP4 files with customizable settings
- **Filter Effects**: Apply brightness, contrast, saturation, and other visual filters

## 📁 Project Structure

```
tinkerium/
├── api/                    # Serverless API endpoints
│   ├── generate-code.ts   # AI code generation handler
│   └── openrouter.ts      # OpenRouter API wrapper
├── shared/                # Shared utilities and configurations
│   └── ai-styles.ts       # AI style presets and prompts
├── tools/                 # Individual tools
│   └── code-to-mp4/       # Code-to-MP4 converter tool
│       ├── src/
│       │   ├── App.tsx           # Main application component
│       │   ├── components/       # UI components
│       │   ├── constants.ts      # App constants
│       │   ├── types.ts          # TypeScript types
│       │   └── utils.ts          # Utility functions
│       ├── index.html
│       └── vite.config.ts
├── index.html            # Landing page
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Video Processing**: MediaRecorder API, canvas-record, mp4-muxer
- **AI Integration**: OpenRouter API
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_SITE_URL=https://your-site.com
OPENROUTER_USER_AGENT=your-app-name/1.0
```

### API Configuration

The project uses OpenRouter for AI code generation. Set up your API key to enable AI features.

## 🎨 AI Style Presets

### Tokyo Night Neon
High-contrast neon aesthetics with blues and pinks on deep navy backgrounds. Perfect for futuristic, cyberpunk-inspired animations.

### Retro CRT
Classic 80s CRT display effects with scanlines, phosphor glow, and authentic analog imperfections.

### Minimal Elegance
Calm, airy designs with soft gradients, generous whitespace, and tasteful micro-interactions.

## 🚀 Usage

### Code-to-MP4 Tool

1. Navigate to `/tools/code-to-mp4/`
2. Write or generate code (HTML/CSS/JS)
3. Preview the animation in real-time
4. Adjust video settings (duration, FPS, filters)
5. Record and download as MP4

### AI Code Generation

1. Select an AI style preset
2. Enter a prompt describing your desired animation
3. Choose between "Animation" or "Text" mode
4. Generate code with AI assistance
5. Edit and refine as needed

## 🏗️ Development

### Adding New Tools

Create a new directory under `/tools/` with its own `index.html` and source files. The build system will automatically detect and include it.

### Adding New AI Styles

Edit `/shared/ai-styles.ts` to add new style presets with custom prompts and configurations.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
