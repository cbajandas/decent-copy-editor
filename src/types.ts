export interface LanguageEntry {
  id: string; // Unique identifier combining file and key (e.g., "common.submit")
  key: string; // Display key without file prefix
  value: string;
  filePath: string;
  fileName: string;
}

export interface LanguageFile {
  fileName: string;
  filePath: string;
  data: Record<string, unknown>;
}

export interface FlattenedData {
  [key: string]: LanguageEntry;
}

export interface FilterOptions {
  searchTerm: string;
  selectedFile: string;
}

export interface EditChange {
  id: string; // The unique identifier combining file and key
  originalValue: string;
  newValue: string;
}

export interface ProjectConfig {
  projectPath: string;
  localesPath: string;
  projectName: string;
  isValidDecentProject: boolean;
}
