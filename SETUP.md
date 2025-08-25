# Setup Guide for Decent Copy Editor

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Getting Started

1. **Clone or copy the project**:
   ```bash
   # If creating from scratch, copy the standalone-copy-editor folder
   cp -r path/to/decent-app/standalone-copy-editor ./decent-copy-editor
   cd decent-copy-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

## Building for Distribution

### Quick Build (Current Platform)
```bash
npm run build-dist
```

### Platform-Specific Builds
```bash
# Windows
npm run build-dist --win

# macOS
npm run build-dist --mac

# Linux
npm run build-dist --linux
```

### Manual Build Commands
```bash
# Build application code
npm run build

# Create distributables
npm run dist:win    # Windows installer (.exe)
npm run dist:mac    # macOS disk image (.dmg)
npm run dist:linux  # Linux AppImage
```

## Project Structure

```
decent-copy-editor/
├── electron/           # Electron main process
│   ├── main.ts        # Main application logic
│   └── preload.ts     # Secure IPC bridge
├── src/               # React frontend
│   ├── App.tsx        # Main component
│   ├── utils.ts       # Utilities and API calls
│   ├── types.ts       # TypeScript definitions
│   ├── icons.tsx      # SVG icon components
│   └── styles.css     # Styling
├── scripts/           # Build and utility scripts
├── dist/              # Built frontend (generated)
├── release/           # Distribution packages (generated)
└── package.json       # Project configuration
```

## Distribution

### Creating Releases

1. **Test the application thoroughly**:
   ```bash
   npm run dev
   # Test with various Decent DAO projects
   ```

2. **Build for target platforms**:
   ```bash
   npm run build-dist --win
   npm run build-dist --mac
   npm run build-dist --linux
   ```

3. **Upload to releases**:
   - Create a new release on GitHub
   - Upload the generated files from `release/` folder
   - Provide installation instructions

### File Outputs

- **Windows**: `decent-copy-editor-setup.exe` (NSIS installer)
- **macOS**: `decent-copy-editor.dmg` (Disk image)
- **Linux**: `decent-copy-editor.AppImage` (Portable executable)

## Usage Instructions for End Users

### Installation

1. Download the appropriate file for your platform
2. Install/run the application:
   - **Windows**: Double-click the `.exe` installer
   - **macOS**: Open the `.dmg` and drag to Applications
   - **Linux**: Make the `.AppImage` executable and run

### First-Time Setup

1. Launch the application
2. Click "Select Project Folder"
3. Navigate to your Decent DAO project root folder
4. Select the folder containing `public/locales/en/`

### Editing Language Files

1. Use the search bar to find specific keys or values
2. Filter by specific files using the dropdown
3. Click in any text area to edit
4. Modified entries are highlighted in orange
5. Click "Save" to write changes back to files

## Troubleshooting

### Common Issues

**"Not a valid Decent DAO project"**
- Ensure the selected folder contains `public/locales/en/` directory
- Check that the folder has a `package.json` file

**"Failed to load language files"**
- Verify file permissions in the project directory
- Check that JSON files are valid and not corrupted

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Update Node.js to the latest LTS version
- Check for platform-specific build requirements

### Development Issues

**Electron not starting**
- Run `npm run build` manually first
- Check console for TypeScript compilation errors

**Hot reload not working**
- Restart the development server
- Electron apps require manual refresh after code changes

## Contributing

1. Make changes to the source code
2. Test thoroughly with multiple projects
3. Update documentation if needed
4. Create builds for testing
5. Submit pull requests with clear descriptions

## License

MIT License - See LICENSE file for details
