# Decent Copy Editor

A standalone desktop application for editing language files in Decent DAO projects.

## Features

- 📝 Edit English language files with a clean, table-based interface
- 🔍 Search and filter across all language entries
- 📁 Select any Decent DAO project folder on your machine
- 💾 Direct file editing with real-time preview
- 🎯 Standalone - no need to integrate into your main project

## Installation

1. Download the latest release for your platform:
   - **Windows**: `decent-copy-editor-setup.exe`
   - **macOS**: `decent-copy-editor.dmg`
   - **Linux**: `decent-copy-editor.AppImage`

2. Install and run the application

3. On first launch, select your Decent DAO project folder when prompted

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

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for distribution
npm run dist
```

## Building from Source

```bash
# Clone the repository
git clone https://github.com/decentdao/decent-copy-editor.git
cd decent-copy-editor

# Install dependencies
npm install

# Build for your platform
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

## License

MIT License - see LICENSE file for details
