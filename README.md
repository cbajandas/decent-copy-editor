# Decent Copy Editor

A standalone desktop application for editing language files in Decent DAO projects.

## Features

- 📝 Edit English language files with a clean, table-based interface
- 🔍 Search and filter across all language entries
- 📁 Select any Decent DAO project folder on your machine
- 💾 Direct file editing with real-time preview
- 🎯 Standalone - no need to integrate into your main project

## Download

🎉 **Ready-to-use executables are available!** No need to build from source.

### Download Latest Release

Visit the [Releases page](https://github.com/cbajandas/decent-copy-editor/releases) and download the appropriate file for your platform:

- **Windows**: `Decent-Copy-Editor-Setup-x.x.x.exe` - Windows installer
- **macOS**: `Decent-Copy-Editor-x.x.x.dmg` - macOS disk image  
- **Linux**: `Decent-Copy-Editor-x.x.x.AppImage` - Portable Linux application

### Installation

1. Download the file for your operating system
2. **Windows**: Run the `.exe` installer and follow the setup wizard
3. **macOS**: Open the `.dmg` file and drag the app to your Applications folder
4. **Linux**: Make the `.AppImage` file executable (`chmod +x`) and run it directly

### First Launch

On first launch, the application will prompt you to select your Decent DAO project folder.

## Usage

1. **Select Project**: Choose the root folder of your Decent DAO project
2. **Browse Files**: View all language files in a unified table
3. **Search & Filter**: Use the search bar to find specific text or keys
4. **Edit**: Click any cell to edit the English text
5. **Save**: Changes are automatically saved to the original files

## Project Requirements

The application expects your project to have the following structure:
```
your-decent-project/
├── public/
│   └── locales/
│       └── en/
│           ├── common.json
│           ├── actions.json
│           └── ...other language files
└── package.json
```

## Development

## Building from Source

If you prefer to build the application yourself or want to contribute:

```bash
# Clone the repository
git clone https://github.com/cbajandas/decent-copy-editor.git
cd decent-copy-editor

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for distribution (creates executable)
npm run dist

# Platform-specific builds
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

The built executables will be available in the `release/` folder.
npm install

# Build for your platform
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

## License

MIT License - see LICENSE file for details
