/**
 * Project Service
 *
 * Manages project files and content. Currently fetches from local demo
 * directory. In the future, this will call the server API.
 */

const ASSETS_BASE = './demo';

/**
 * List all available projects
 * @returns {Promise<string[]>} Array of project names
 */
export async function listProjects() {
  // In the future, this will call: GET /api/projects
  // For now, return hardcoded list matching demo directory
  return ['WarrenBuffer', 'marketbuffer-api'];
}

/**
 * List files for a project
 * @param {string} project - Project name
 * @returns {Promise<Array>} Array of file tree nodes
 */
export async function listFiles(project) {
  // In the future, this will call: GET /api/projects/:project/files
  // For now, return hardcoded file structure matching assets directory

  const fileStructures = {
    'WarrenBuffer': [
      { name: 'main.py', type: 'file' },
      { name: 'portfolio.py', type: 'file' },
      { name: 'data.py', type: 'file' },
      { name: 'config.yaml', type: 'file' },
      {
        name: 'strategies',
        type: 'folder',
        children: [
          { name: 'value.py', type: 'file' },
          { name: 'moat.py', type: 'file' },
        ],
      },
    ],
    'marketbuffer-api': [
      { name: 'main.go', type: 'file' },
      { name: 'go.mod', type: 'file' },
      {
        name: 'handlers',
        type: 'folder',
        children: [
          { name: 'auth.go', type: 'file' },
          { name: 'users.go', type: 'file' },
          { name: 'projects.go', type: 'file' },
        ],
      },
      {
        name: 'models',
        type: 'folder',
        children: [
          { name: 'user.go', type: 'file' },
          { name: 'project.go', type: 'file' },
        ],
      },
    ],
  };

  return fileStructures[project] || [];
}

/**
 * Load file content
 * @param {string} project - Project name
 * @param {string} filepath - File path relative to project root (e.g., "main.py" or "strategies/value.py")
 * @returns {Promise<string>} File content
 */
export async function loadFile(project, filepath) {
  // In the future, this will call: GET /api/projects/:project/files/:filepath
  // For now, fetch from assets directory

  const url = `${ASSETS_BASE}/${project}/${filepath}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error loading file ${filepath}:`, error);
    throw error;
  }
}

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} Extension without dot
 */
export function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop() : '';
}

/**
 * Get language for syntax highlighting based on extension
 * @param {string} filename - File name
 * @returns {string} Language identifier
 */
export function getFileLanguage(filename) {
  const ext = getFileExtension(filename);

  const languageMap = {
    'py': 'python',
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'go': 'go',
    'rs': 'rust',
    'yaml': 'yaml',
    'yml': 'yaml',
    'json': 'json',
    'md': 'markdown',
    'html': 'html',
    'css': 'css',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'txt': 'text',
  };

  return languageMap[ext] || 'text';
}

/**
 * Build full file path from tree node
 * @param {Object} file - File tree node
 * @param {string} parentPath - Parent path
 * @returns {string} Full path
 */
export function buildFilePath(file, parentPath = '') {
  if (parentPath) {
    return `${parentPath}/${file.name}`;
  }
  return file.name;
}
