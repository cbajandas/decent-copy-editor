import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

interface ProjectConfig {
  projectPath: string;
  localesPath: string;
  projectName: string;
  isValidDecentProject: boolean;
}

let mainWindow: BrowserWindow | null = null;
let currentProject: ProjectConfig | null = null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Load the app from the built files
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Validate if a directory is a valid Decent DAO project
async function validateDecentProject(projectPath: string): Promise<ProjectConfig> {
  try {
    const localesPath = path.join(projectPath, 'public', 'locales', 'en');
    const packageJsonPath = path.join(projectPath, 'package.json');

    // Check if the required directories exist
    await fs.access(localesPath);
    await fs.access(packageJsonPath);

    // Read package.json to get project name
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    return {
      projectPath,
      localesPath,
      projectName: packageJson.name || 'Decent Project',
      isValidDecentProject: true,
    };
  } catch (error) {
    throw new Error(`Not a valid Decent DAO project: ${error}`);
  }
}

// Get all available language files in the project
async function getAvailableLanguageFiles(localesPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(localesPath);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading locales directory:', error);
    return [];
  }
}

// Read a specific language file
async function readLanguageFile(localesPath: string, fileName: string): Promise<any> {
  try {
    const filePath = path.join(localesPath, `${fileName}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading language file ${fileName}:`, error);
    throw error;
  }
}

// Write a language file while preserving trailing newlines
async function writeLanguageFile(localesPath: string, fileName: string, data: any): Promise<void> {
  try {
    const filePath = path.join(localesPath, `${fileName}.json`);
    
    // Check if original file had trailing newline
    let hasTrailingNewline = false;
    try {
      const originalContent = await fs.readFile(filePath, 'utf-8');
      hasTrailingNewline = originalContent.endsWith('\n');
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Format the content with proper indentation
    let formattedContent = JSON.stringify(data, null, 2);
    
    // Preserve trailing newline if the original had one
    if (hasTrailingNewline) {
      formattedContent += '\n';
    }
    
    await fs.writeFile(filePath, formattedContent, 'utf-8');
    console.log(`Saved: ${fileName}.json`);
  } catch (error) {
    console.error(`Error writing language file ${fileName}:`, error);
    throw error;
  }
}

// IPC Handlers
ipcMain.handle('select-project-folder', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Decent DAO Project Folder',
    message: 'Choose the root folder of your Decent DAO project'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const projectConfig = await validateDecentProject(result.filePaths[0]);
      currentProject = projectConfig;
      return projectConfig;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
  return null;
});

ipcMain.handle('get-current-project', async () => {
  return currentProject;
});

ipcMain.handle('get-available-files', async () => {
  if (!currentProject) {
    throw new Error('No project selected');
  }
  return await getAvailableLanguageFiles(currentProject.localesPath);
});

ipcMain.handle('get-language-file', async (_, fileName: string) => {
  if (!currentProject) {
    throw new Error('No project selected');
  }
  return await readLanguageFile(currentProject.localesPath, fileName);
});

ipcMain.handle('save-language-file', async (_, fileName: string, data: any) => {
  if (!currentProject) {
    throw new Error('No project selected');
  }
  await writeLanguageFile(currentProject.localesPath, fileName, data);
  return true;
});

// App event listeners
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app updates (simple notification)
app.on('ready', () => {
  // We could add a simple update check here in the future if needed
  console.log('Decent Copy Editor started');
});
