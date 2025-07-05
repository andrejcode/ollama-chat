# OllamaChat

A modern desktop chat application for conversing with AI models through Ollama. Built with Electron, React, and TypeScript.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-30+-green.svg)](https://www.electronjs.org/)

## Features

- 🚀 **Native Desktop Experience** - Cross-platform Electron application
- 💬 **Real-time Chat** - Streaming responses from Ollama models
- 💾 **Persistent History** - SQLite database stores all conversations
- 🎨 **Modern UI** - Clean interface with dark/light theme support
- 📝 **Rich Markdown** - Syntax highlighting, math equations, and formatted text
- 🔧 **Model Management** - Easy switching between available Ollama models
- 📊 **Health Monitoring** - Real-time connection status with Ollama
- ⚡ **Fast & Responsive** - Built with modern web technologies

## Prerequisites

Before running OllamaChat, you need to have [Ollama](https://ollama.ai/) installed and running on your system.

### System Requirements

- **Node.js**: 20.x or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB available space

### Installing Ollama

1. **Linux:**

   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **macOS/Windows:**
   Download from [ollama.ai](https://ollama.ai/download)

3. **Start Ollama service:**

   ```bash
   ollama serve
   ```

4. **Pull a model (optional):**
   ```bash
   ollama pull llama3.1
   ```

## Quick Start

<!-- ### For Users

1. **Download the latest release** from the [Releases page](https://github.com/andrejcode/ollama-chat/releases)
2. **Install Ollama** following the [Prerequisites](#prerequisites) section
3. **Launch OllamaChat** and start chatting! -->

### For Developers

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andrejcode/ollama-chat.git
   cd ollama-chat
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. **Launch the application** - Open OllamaChat from your applications folder or run `npm run dev`

2. **Check connection** - The app will automatically detect if Ollama is running

3. **Select a model** - Choose from available models in the header dropdown

4. **Start chatting** - Type your message and press Enter or click Send

5. **Manage chats** - Use the sidebar to navigate between conversations

## Configuration

### Application Settings

Access settings through the gear icon in the application header.

#### Ollama URL

By default, OllamaChat connects to `http://localhost:11434`. You can change this in Settings if Ollama is running on a different host or port.

#### Themes

Switch between light, dark, and system themes using the theme toggle in the settings modal.

#### Sidebar

Toggle the conversation sidebar on/off to maximize chat space.

## Development

### Project Structure

```
ollama-chat/
├── electron/          # Electron main process
│   ├── main/          # Application entry point
│   ├── db/            # SQLite database layer
│   ├── ollama/        # Ollama API integration
│   └── types/         # Electron-specific types
├── src/               # React renderer process
│   ├── components/    # UI components
│   ├── stores/        # Zustand state management
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
└── shared/            # Code shared between processes
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript and package with electron-builder
- `npm run lint` - Run ESLint with TypeScript extensions
- `npm run format` - Format code with Prettier
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build

### Architecture Overview

- **State Management**: Zustand stores for UI state + electron-store for persistent app settings
- **Database**: SQLite with better-sqlite3 for chat persistence
- **IPC Communication**: Type-safe channels between main and renderer processes
- **Styling**: Tailwind CSS with custom design system
- **Testing**: Vitest with jsdom environment

## Contributing

We welcome contributions to OllamaChat! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/andrejcode/ollama-chat.git
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

### Development Guidelines

#### Code Style

- Follow the existing TypeScript and React patterns
- Use Zustand stores for UI state management (avoid prop drilling)
- Use electron-store for persistent application settings
- Follow the established component structure in `src/components/`
- Maintain type safety throughout the codebase

#### Testing

- Write tests for new features using Vitest and Testing Library
- Run tests before submitting: `npm test`
- Ensure all existing tests pass

#### Code Quality

- Run linting before committing: `npm run lint`
- Format code with Prettier: `npm run format`
- Follow semantic commit messages (e.g., `feat:`, `fix:`, `docs:`)

### Types of Contributions

- 🐛 **Bug fixes** - Fix issues or improve existing functionality
- ✨ **New features** - Add new capabilities to the application
- 📚 **Documentation** - Improve README, code comments, or guides
- 🎨 **UI/UX improvements** - Enhance the user interface or experience
- ⚡ **Performance** - Optimize speed, memory usage, or bundle size
- 🧪 **Testing** - Add or improve test coverage

### Submitting Changes

1. **Commit your changes** with clear, descriptive messages
2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Screenshots for UI changes
   - Reference to any related issues

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/andrejcode/ollama-chat/issues) with:

- **Bug reports**: Steps to reproduce, expected vs actual behavior, system info
- **Feature requests**: Clear description of the proposed feature and use case
- **Questions**: Use discussions for general questions about usage

### Development Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## Troubleshooting

### Common Issues

**Ollama not detected**

- Ensure Ollama is installed and running (`ollama serve`)
- Check if Ollama is accessible at `http://localhost:11434`
- Verify firewall settings aren't blocking the connection

**Models not loading**

- Make sure you have at least one model pulled (`ollama pull llama3.1`)
- Check Ollama logs for any error messages

**Application won't start**

- Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`
- Ensure you're using a supported Node.js version (20+)
- Check that all dependencies are properly installed

**Build errors**

- Ensure you have the correct Node.js version installed
- Clear the dist and dist-electron folders: `rm -rf dist dist-electron`
- Reinstall dependencies: `npm install`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] **Export/Import** - Backup and restore chat history
- [ ] **Custom Models** - Support for custom model configurations
- [ ] **Keyboard Shortcuts** - Enhanced keyboard navigation
- [ ] **Chat Templates** - Predefined conversation starters
- [ ] **Multi-language Support** - Internationalization
- [ ] **Plugin System** - Extensible architecture for custom features

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local AI model infrastructure
- [Electron](https://www.electronjs.org/) for enabling cross-platform desktop development
- [React](https://react.dev/) and the amazing ecosystem of tools and libraries
- [OpenAI](https://openai.com/) for the ChatGPT interface design that inspired this application's UI
- All contributors who help improve OllamaChat

---

⭐ **Star this repo** if you find it helpful!

💡 **Have a feature request?** [Open an issue](https://github.com/andrejcode/ollama-chat/issues) to let us know!
