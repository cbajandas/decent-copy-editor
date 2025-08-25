/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    isElectron: boolean;
    selectProjectFolder(): Promise<ProjectConfig | { error: string } | null>;
    getCurrentProject(): Promise<ProjectConfig | null>;
    getAvailableFiles(): Promise<string[]>;
    getLanguageFile(fileName: string): Promise<any>;
    saveLanguageFile(fileName: string, data: any): Promise<boolean>;
  };
}

interface ProjectConfig {
  projectPath: string;
  localesPath: string;
  projectName: string;
  isValidDecentProject: boolean;
}
