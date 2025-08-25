import { contextBridge, ipcRenderer } from 'electron';

interface ProjectConfig {
  projectPath: string;
  localesPath: string;
  projectName: string;
  isValidDecentProject: boolean;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  
  // Project management
  selectProjectFolder: (): Promise<ProjectConfig | { error: string } | null> => {
    return ipcRenderer.invoke('select-project-folder');
  },
  
  getCurrentProject: (): Promise<ProjectConfig | null> => {
    return ipcRenderer.invoke('get-current-project');
  },
  
  // File operations
  getAvailableFiles: (): Promise<string[]> => {
    return ipcRenderer.invoke('get-available-files');
  },
  
  getLanguageFile: (fileName: string): Promise<any> => {
    return ipcRenderer.invoke('get-language-file', fileName);
  },
  
  saveLanguageFile: (fileName: string, data: any): Promise<boolean> => {
    return ipcRenderer.invoke('save-language-file', fileName, data);
  },
});

// TypeScript declaration for the exposed API
declare global {
  interface Window {
    electronAPI: {
      isElectron: boolean;
      selectProjectFolder(): Promise<ProjectConfig | { error: string } | null>;
      getCurrentProject(): Promise<ProjectConfig | null>;
      getAvailableFiles(): Promise<string[]>;
      getLanguageFile(fileName: string): Promise<any>;
      saveLanguageFile(fileName: string, data: any): Promise<boolean>;
    };
  }
}
