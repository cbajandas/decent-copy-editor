# Decent Copy Editor

A standalone desktop application for editing Decent DAO project language files with a clean, intuitive interface.

## Features

- **Project Detection**: Automatically validates Decent DAO project structure
- **Live Search**: Find keys and values across all language files
- **File Filtering**: Focus on specific translation files
- **Visual Feedback**: Modified entries highlighted for easy tracking
- **Auto-save**: Changes written directly to JSON files
- **Cross-platform**: Windows, macOS, and Linux support

## Quick Start

### For Users

1. **Download** the latest release for your platform:
   - Windows: `decent-copy-editor-setup.exe`
   - macOS: `decent-copy-editor.dmg`
   - Linux: `decent-copy-editor.AppImage`

2. **Install and Launch**
   - Windows: Run the installer
   - macOS: Drag to Applications folder
   - Linux: Make executable and run

3. **Setup Project**
   - Click "Select Project Folder"
   - Choose your Decent DAO project root (containing `public/locales/en/`)
   - Start editing!

### For Developers

```bash
# Clone and setup
git clone <repository-url> decent-copy-editor
cd decent-copy-editor
npm install

# Development
npm run dev

# Build distributables
npm run build-dist
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Project Structure
```
decent-copy-editor/
├── electron/          # Main process (main.ts, preload.ts)
├── src/              # React frontend (App.tsx, utils.ts, etc.)
├── scripts/          # Build scripts
└── release/          # Generated distributables
```

### Build Commands
```bash
npm run dev           # Development server
npm run build         # Build frontend
npm run build-dist    # Create distributables for current platform
npm run dist:win      # Windows installer
npm run dist:mac      # macOS disk image  
npm run dist:linux    # Linux AppImage
```

## Troubleshooting

**"Not a valid Decent DAO project"**
- Ensure folder contains `public/locales/en/` directory

**Build issues**
- Clear dependencies: `rm -rf node_modules && npm install`
- Update Node.js to latest LTS

**File loading errors**
- Check file permissions and JSON validity

## Contributing

1. Fork the repository
2. Create feature branch
3. Test with multiple Decent DAO projects
4. Submit pull request

## License

MIT License
