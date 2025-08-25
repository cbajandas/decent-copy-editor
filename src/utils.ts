import { LanguageFile, LanguageEntry, FlattenedData, EditChange, ProjectConfig } from './types';

/**
 * Flattens a nested object into a flat structure with dot notation keys
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  result: Record<string, unknown> = {},
): Record<string, unknown> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value as Record<string, unknown>, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
}

/**
 * Checks if the app is running in Electron
 */
function isElectron(): boolean {
  return typeof window !== 'undefined' && 
         !!window.electronAPI && 
         window.electronAPI.isElectron === true;
}

/**
 * Prompts user to select a project folder
 */
export async function selectProjectFolder(): Promise<ProjectConfig | null> {
  if (!isElectron()) {
    throw new Error('Project selection is only available in the desktop app');
  }

  const result = await window.electronAPI!.selectProjectFolder();
  
  if (result && 'error' in result) {
    throw new Error(result.error);
  }
  
  return result;
}

/**
 * Gets the currently selected project
 */
export async function getCurrentProject(): Promise<ProjectConfig | null> {
  if (!isElectron()) {
    return null;
  }

  return await window.electronAPI!.getCurrentProject();
}

/**
 * Loads and parses all language files from the selected project
 */
export async function loadLanguageFiles(): Promise<LanguageFile[]> {
  const files: LanguageFile[] = [];

  try {
    if (!isElectron()) {
      throw new Error('Language file loading is only available in the desktop app');
    }

    // Get the list of available files from the selected project
    const fileNames = await window.electronAPI!.getAvailableFiles();

    for (const fileName of fileNames) {
      try {
        const data = await window.electronAPI!.getLanguageFile(fileName);
        files.push({
          fileName,
          filePath: `public/locales/en/${fileName}.json`,
          data,
        });
      } catch (error) {
        console.error(`Failed to load ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading language files:', error);
    throw error;
  }

  return files;
}

/**
 * Flattens language files into a table-friendly format
 */
export function flattenLanguageFiles(files: LanguageFile[]): FlattenedData {
  const flattened: FlattenedData = {};

  files.forEach(file => {
    const flatData = flattenObject(file.data);
    
    Object.entries(flatData).forEach(([key, value]) => {
      const id = `${file.fileName}.${key}`;
      flattened[id] = {
        id,
        key,
        value: String(value || ''),
        filePath: file.filePath,
        fileName: file.fileName,
      };
    });
  });

  return flattened;
}

/**
 * Filters entries based on search term and selected file
 */
export function filterEntries(
  flattenedData: FlattenedData,
  searchTerm: string,
  selectedFile: string
): LanguageEntry[] {
  const entries = Object.values(flattenedData);
  
  return entries.filter(entry => {
    // Filter by file if specified
    if (selectedFile !== 'all' && entry.fileName !== selectedFile) {
      return false;
    }
    
    // Filter by search term if specified
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        entry.key.toLowerCase().includes(term) ||
        entry.value.toLowerCase().includes(term) ||
        entry.fileName.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
}

/**
 * Applies pending changes to the original language files data structure
 * Returns only the files that have actual changes
 */
export function applyChangesToFiles(
  files: LanguageFile[],
  changes: Map<string, EditChange>
): LanguageFile[] {
  if (changes.size === 0) {
    return [];
  }

  const modifiedFiles: LanguageFile[] = [];

  files.forEach(file => {
    const updatedData = { ...file.data };
    let hasChanges = false;

    // Find all changes for this file
    changes.forEach(change => {
      const [fileName, ...keyParts] = change.id.split('.');
      if (fileName === file.fileName) {
        const key = keyParts.join('.');
        setNestedValue(updatedData, key, change.newValue);
        hasChanges = true;
      }
    });

    // Only include files that actually have changes
    if (hasChanges) {
      modifiedFiles.push({ ...file, data: updatedData });
    }
  });

  return modifiedFiles;
}

/**
 * Sets a nested value in an object using dot notation
 */
function setNestedValue(obj: any, path: string, value: string): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Saves the updated files back to disk
 */
export async function saveUpdatedFiles(files: LanguageFile[]): Promise<void> {
  if (!isElectron()) {
    throw new Error('File saving is only available in the desktop app');
  }

  const savePromises = files.map(async file => {
    try {
      await window.electronAPI!.saveLanguageFile(file.fileName, file.data);
    } catch (error) {
      console.error(`Failed to save ${file.fileName}:`, error);
      throw error;
    }
  });

  await Promise.all(savePromises);
}

/**
 * Gets unique file names from the flattened data for the filter dropdown
 */
export function getUniqueFileNames(flattenedData: FlattenedData): string[] {
  const fileNames = new Set<string>();
  Object.values(flattenedData).forEach(entry => {
    fileNames.add(entry.fileName);
  });
  return Array.from(fileNames).sort();
}
