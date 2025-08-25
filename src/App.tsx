import { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchIcon, FileTextIcon, Edit3Icon, SaveIcon, FolderIcon, RefreshIcon } from './icons';
import { LanguageFile, EditChange, ProjectConfig } from './types';
import {
  selectProjectFolder,
  getCurrentProject,
  loadLanguageFiles,
  flattenLanguageFiles,
  filterEntries,
  applyChangesToFiles,
  saveUpdatedFiles,
  getUniqueFileNames,
} from './utils';
import './styles.css';

function App() {
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);
  const [languageFiles, setLanguageFiles] = useState<LanguageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('all');
  const [changes, setChanges] = useState<Map<string, EditChange>>(new Map());
  const [saving, setSaving] = useState<boolean>(false);

  // Check for existing project on component mount
  useEffect(() => {
    const checkCurrentProject = async () => {
      try {
        setLoading(true);
        const project = await getCurrentProject();
        if (project) {
          setCurrentProject(project);
          await loadProjectFiles();
        }
      } catch (err) {
        console.error('Error checking current project:', err);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentProject();
  }, []);

  // Load language files for the current project
  const loadProjectFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await loadLanguageFiles();
      setLanguageFiles(files);
      setChanges(new Map());
      setSearchTerm('');
      setSelectedFile('all');
    } catch (err) {
      setError(
        'Failed to load language files. Please ensure the selected folder contains a valid Decent DAO project.',
      );
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle project folder selection
  const handleSelectProject = async () => {
    try {
      setError(null);
      const project = await selectProjectFolder();
      if (project) {
        setCurrentProject(project);
        await loadProjectFiles();
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle refreshing the current project
  const handleRefreshProject = async () => {
    if (currentProject) {
      await loadProjectFiles();
    }
  };

  // Flatten language files for table display
  const flattenedData = useMemo(() => {
    return flattenLanguageFiles(languageFiles);
  }, [languageFiles]);

  // Filter entries based on search and file selection
  const filteredEntries = useMemo(() => {
    return filterEntries(flattenedData, searchTerm, selectedFile);
  }, [flattenedData, searchTerm, selectedFile]);

  // Get unique file names for the dropdown
  const fileNames = useMemo(() => {
    return getUniqueFileNames(flattenedData);
  }, [flattenedData]);

  // Handle text value changes
  const handleValueChange = useCallback(
    (entryId: string, newValue: string) => {
      const entry = flattenedData[entryId];
      if (!entry) return;

      setChanges(prev => {
        const newChanges = new Map(prev);
        
        if (newValue === entry.value) {
          // Value reverted to original, remove from changes
          newChanges.delete(entryId);
        } else {
          // Value changed, add or update change
          newChanges.set(entryId, {
            id: entryId,
            originalValue: entry.value,
            newValue,
          });
        }
        
        return newChanges;
      });
    },
    [flattenedData]
  );

  // Handle saving changes
  const handleSave = useCallback(async () => {
    if (changes.size === 0) return;

    try {
      setSaving(true);
      setError(null);

      // Apply changes to files and save
      const updatedFiles = applyChangesToFiles(languageFiles, changes);
      await saveUpdatedFiles(updatedFiles);

      // Update state with saved files
      setLanguageFiles(updatedFiles);
      setChanges(new Map());
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error('Error saving files:', err);
    } finally {
      setSaving(false);
    }
  }, [languageFiles, changes]);

  // Show project selection if no project is selected
  if (!currentProject) {
    return (
      <div className="app">
        <div className="header">
          <div>
            <h1>Decent Copy Editor</h1>
            <p>Standalone desktop editor for Decent DAO language files</p>
          </div>
          <div className="electron-indicator">
            <span className="electron-badge">Desktop App</span>
          </div>
        </div>
        
        <div className="project-selector">
          <h2>Select Project Folder</h2>
          <p>
            Choose the root folder of your Decent DAO project to start editing language files.
            <br />
            The folder should contain <code>public/locales/en/</code> directory with JSON files.
          </p>
          <button 
            className="select-project-button" 
            onClick={handleSelectProject}
            disabled={loading}
          >
            <FolderIcon size={18} />
            {loading ? 'Loading...' : 'Select Project Folder'}
          </button>
          {error && (
            <div className="error" style={{ marginTop: '16px', textAlign: 'left' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>Decent Copy Editor</h1>
          <p>Editing language files for your Decent DAO project</p>
        </div>
        <div className="electron-indicator">
          <span className="electron-badge">Desktop App</span>
        </div>
      </div>

      <div className="project-info">
        <div className="project-details">
          <h3>{currentProject.projectName}</h3>
          <p>{currentProject.projectPath}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="change-project-button" 
            onClick={handleRefreshProject}
            disabled={loading}
            title="Refresh project files"
          >
            <RefreshIcon size={16} />
            Refresh
          </button>
          <button 
            className="change-project-button" 
            onClick={handleSelectProject}
            disabled={loading}
          >
            <FolderIcon size={16} />
            Change Project
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading language files...</div>
      ) : (
        <>
          <div className="controls">
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <SearchIcon 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#666' 
                }} 
              />
              <input
                type="text"
                placeholder="Search keys or values..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
            
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="file-select"
            >
              <option value="all">All files</option>
              {fileNames.map(fileName => (
                <option key={fileName} value={fileName}>
                  {fileName}.json
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={changes.size === 0 || saving}
              className="save-button"
            >
              <SaveIcon size={16} />
              {saving ? 'Saving...' : `Save${changes.size > 0 ? ` (${changes.size})` : ''}`}
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <FileTextIcon size={16} />
              <span>{filteredEntries.length} entries</span>
            </div>
            <div className="stat">
              <Edit3Icon size={16} />
              <span>
                {changes.size} changes
                {changes.size > 0 && <span className="changes-indicator">{changes.size}</span>}
              </span>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Key</th>
                  <th style={{ width: '50%' }}>Value</th>
                  <th style={{ width: '25%' }}>File</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const change = changes.get(entry.id);
                  const currentValue = change ? change.newValue : entry.value;
                  const isModified = !!change;

                  return (
                    <tr key={entry.id}>
                      <td className="key-cell">{entry.key}</td>
                      <td className="value-cell">
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleValueChange(entry.id, e.target.value)}
                          className={`value-textarea ${isModified ? 'modified' : ''}`}
                          rows={Math.max(2, Math.ceil(currentValue.length / 50))}
                        />
                      </td>
                      <td className="file-cell">{entry.fileName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
