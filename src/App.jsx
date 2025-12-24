import React, { useState, useEffect, useRef } from 'react';
import './AppSVAR.css';
import * as fileApi from './api/fileApi';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuItem, setContextMenuItem] = useState(null);
  const [showModal, setShowModal] = useState(null); // 'rename', 'newfolder', 'upload', 'delete', 'imageview'
  const [inputValue, setInputValue] = useState('');
  const [fileData, setFileData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'size', 'type'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewingImage, setViewingImage] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  // Load files and folders from API
  useEffect(() => {
    loadData();
  }, [currentFolderId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch files and folders from API
      const [filesData, foldersData] = await Promise.all([
        fileApi.fetchFiles(currentFolderId),
        fileApi.fetchFolders()
      ]);
      
      // Transform API data to app format
      const transformedFiles = filesData.files?.map(file => ({
        id: file.id,
        name: file.name,
        type: getFileType(file.mime_type),
        date: new Date(file.created_at).toISOString().split('T')[0],
        size: file.size_display || formatFileSize(file.size_bytes),
        telegram_file_id: file.telegram_file_id,
        mime_type: file.mime_type,
        isFolder: false
      })) || [];
      
      const transformedFolders = foldersData.folders?.map(folder => ({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        date: new Date(folder.created_at).toISOString().split('T')[0],
        size: '',
        isFolder: true
      })) || [];
      
      setFileData([...transformedFolders, ...transformedFiles]);
      setFolders(foldersData.folders || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load files. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (mimeType) => {
    if (!mimeType) return 'document';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
    if (mimeType.includes('text') || mimeType.includes('json')) return 'code';
    return 'document';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    if (kb >= 1) return `${kb.toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const getCurrentItems = () => {
    let items = fileData;
    
    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort items
    return sortItems(items);
  };

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'size') {
        const sizeA = parseSize(a.size);
        const sizeB = parseSize(b.size);
        comparison = sizeA - sizeB;
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const parseSize = (sizeStr) => {
    if (!sizeStr) return 0;
    const units = { 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
    const match = sizeStr.match(/(\d+\.?\d*)\s*(\w+)/);
    if (match) {
      return parseFloat(match[1]) * (units[match[2]] || 1);
    }
    return 0;
  };

  const getFileIcon = (type) => {
    const icons = {
      folder: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      pdf: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
      document: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      image: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      ),
      video: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
      audio: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      ),
      code: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      archive: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      ),
    };
    return icons[type] || icons.document;
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
      setCurrentFolderId(item.id);
      setSelectedItems(new Set());
    } else if (item.type === 'image') {
      setViewingImage(item);
    }
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      const parentFolder = folders.find(f => f.name === currentPath[currentPath.length - 2]);
      setCurrentFolderId(parentFolder?.id || null);
      setSelectedItems(new Set());
    }
  };

  const toggleItemSelection = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // File operations
  const handleCreateFolder = async () => {
    if (!inputValue.trim()) return;
    
    try {
      setLoading(true);
      await fileApi.createFolder(inputValue, currentFolderId);
      await loadData();
      setShowModal(null);
      setInputValue('');
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setLoading(true);
      await fileApi.uploadFiles(files, currentFolderId);
      await loadData();
      setShowModal(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload files: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!inputValue.trim() || !contextMenuItem) return;
    
    try {
      setLoading(true);
      
      if (contextMenuItem.isFolder) {
        alert('Folder rename not yet supported');
        return;
      }
      
      await fileApi.renameFile(contextMenuItem.id, inputValue);
      await loadData();
      setShowModal(null);
      setInputValue('');
      setContextMenuItem(null);
    } catch (err) {
      console.error('Error renaming:', err);
      alert('Failed to rename: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const itemsToDelete = contextMenuItem 
      ? [contextMenuItem]
      : Array.from(selectedItems).map(id => 
          fileData.find(item => item.id === id)
        ).filter(Boolean);
    
    if (itemsToDelete.length === 0) return;
    
    try {
      setLoading(true);
      
      for (const item of itemsToDelete) {
        if (item.isFolder) {
          await fileApi.deleteFolder(item.id);
        } else {
          await fileApi.deleteFile(item.id);
        }
      }
      
      await loadData();
      setShowModal(null);
      setSelectedItems(new Set());
      setContextMenuItem(null);
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item) => {
    try {
      if (item.isFolder) {
        alert('Cannot download folders');
        return;
      }
      
      setLoading(true);
      const downloadUrl = await fileApi.getDownloadURL(item.id);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error downloading:', err);
      alert('Failed to download: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeFromName = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'pdf',
      'doc': 'document', 'docx': 'document', 'txt': 'document',
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
      'mp4': 'video', 'avi': 'video', 'mov': 'video',
      'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio',
      'js': 'code', 'html': 'code', 'css': 'code', 'json': 'code',
      'zip': 'archive', 'rar': 'archive', '7z': 'archive'
    };
    return typeMap[ext] || 'document';
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuItem(item);
    setShowContextMenu(true);
  };

  const closeContextMenu = () => {
    setShowContextMenu(false);
    setContextMenuItem(null);
  };

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const currentItems = getCurrentItems();

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <h1 className="app-title">Tgridu File Manager</h1>
            <span className="premium-badge">PREMIUM</span>
          </div>
          
          <div className="header-actions">
            <button 
              className="view-toggle"
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              aria-label="Toggle view mode"
            >
              {viewMode === 'table' ? (
                <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              ) : (
                <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              )}
            </button>
            
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner" style={{
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            margin: '1rem',
            color: '#c33'
          }}>
            {error}
          </div>
        )}
        
        {loading && (
          <div className="loading-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <div className="spinner" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        )}
        
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="breadcrumb">
              <div className="breadcrumb-item">
                <button onClick={() => setCurrentPath([])}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  Home
                </button>
              </div>
              {currentPath.map((pathId, index) => {
                let items = fileData;
                for (let i = 0; i <= index; i++) {
                  const folder = items.find(item => item.id === currentPath[i]);
                  if (i === index) {
                    return (
                      <React.Fragment key={pathId}>
                        <span className="breadcrumb-separator">/</span>
                        <div className="breadcrumb-item">
                          <button onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}>
                            {folder?.name}
                          </button>
                        </div>
                      </React.Fragment>
                    );
                  }
                  if (folder?.items) {
                    items = folder.items;
                  }
                }
                return null;
              })}
            </div>
          </div>

          <div className="toolbar-right">
            <div className="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
                <option value="date">Date</option>
              </select>
              <button 
                className="toolbar-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <div className="file-manager">
          <div className="file-manager-toolbar">
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={currentItems.length > 0 && selectedItems.size === currentItems.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(new Set(currentItems.map(item => item.id)));
                  } else {
                    setSelectedItems(new Set());
                  }
                }}
                disabled={currentItems.length === 0}
              />
              <span>Select All</span>
            </label>

            <button className="toolbar-btn primary" onClick={() => setShowModal('upload')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload
            </button>

            <button className="toolbar-btn" onClick={() => setShowModal('newfolder')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
              New Folder
            </button>

            {selectedItems.size > 0 && (
              <button 
                className="toolbar-btn"
                onClick={() => {
                  setContextMenuItem(null);
                  setShowModal('delete');
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete ({selectedItems.size})
              </button>
            )}
          </div>

          {viewMode === 'table' ? (
            <table className="file-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th onClick={() => handleSort('name')}>Name</th>
                    <th onClick={() => handleSort('type')} style={{ width: '120px' }}>Type</th>
                    <th onClick={() => handleSort('size')} style={{ width: '100px' }}>Size</th>
                    <th onClick={() => handleSort('date')} style={{ width: '120px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <p>{searchQuery ? 'No files found' : 'This folder is empty'}</p>
                          <small>Upload files or create folders to get started</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item) => (
                      <tr
                        key={item.id}
                        className={selectedItems.has(item.id) ? 'selected' : ''}
                        onClick={() => handleItemClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="file-checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => toggleItemSelection(item.id, e)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>
                          <div className="file-name-cell">
                            <div className={`file-icon ${item.type}`}>
                              {getFileIcon(item.type)}
                            </div>
                            <span className="file-name">{item.name}</span>
                          </div>
                        </td>
                        <td><span className="file-type">{item.type}</span></td>
                        <td><span className="file-size">{item.size || '—'}</span></td>
                        <td><span className="file-date">{item.date}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="file-cards">
                {currentItems.length === 0 ? (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>{searchQuery ? 'No files found' : 'This folder is empty'}</p>
                    <small>Upload files or create folders to get started</small>
                  </div>
                ) : (
                  currentItems.map((item) => (
                    <div
                      key={item.id}
                      className={`file-card ${selectedItems.has(item.id) ? 'selected' : ''}`}
                      onClick={() => handleItemClick(item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                    >
                      <input
                        type="checkbox"
                        className="file-card-checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => toggleItemSelection(item.id, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={`file-icon ${item.type}`}>
                        {getFileIcon(item.type)}
                      </div>
                      <div className="file-name">{item.name}</div>
                      <div className="file-card-info">
                        <span>{item.type}</span>
                        {item.size && <span>{item.size}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {showContextMenu && contextMenuItem && (
            <div 
              className="context-menu"
              style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
            >
              {contextMenuItem.type === 'image' && (
                <button onClick={() => {
                  setViewingImage(contextMenuItem);
                  closeContextMenu();
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              )}

              <button onClick={() => {
                setInputValue(contextMenuItem.name);
                setShowModal('rename');
                closeContextMenu();
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Rename
              </button>
              
              {contextMenuItem.type !== 'folder' && (
                <button onClick={() => {
                  handleDownload(contextMenuItem);
                  closeContextMenu();
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
              )}
              
              <button 
                className="danger"
                onClick={() => {
                  setShowModal('delete');
                  closeContextMenu();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>
                    {showModal === 'rename' && 'Rename Item'}
                    {showModal === 'newfolder' && 'Create New Folder'}
                    {showModal === 'upload' && 'Upload Files'}
                    {showModal === 'delete' && 'Confirm Delete'}
                  </h3>
                  <button className="close-btn" onClick={() => setShowModal(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="modal-body">
                  {(showModal === 'rename' || showModal === 'newfolder') && (
                    <>
                      <input
                        type="text"
                        placeholder={showModal === 'rename' ? 'Enter new name' : 'Folder name'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            showModal === 'rename' ? handleRename() : handleCreateFolder();
                          }
                        }}
                        autoFocus
                      />
                    </>
                  )}
                  
                  {showModal === 'upload' && (
                    <div className="upload-area">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                      />
                      <button 
                        className="upload-trigger"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>Click to select files</span>
                      </button>
                    </div>
                  )}
                  
                  {showModal === 'delete' && (
                    <p>
                      Are you sure you want to delete {
                        contextMenuItem 
                          ? `"${contextMenuItem.name}"`
                          : `${selectedItems.size} item(s)`
                      }?
                    </p>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button className="btn secondary" onClick={() => {
                    setShowModal(null);
                    setInputValue('');
                  }}>
                    Cancel
                  </button>
                  
                  {showModal === 'rename' && (
                    <button className="btn primary" onClick={handleRename}>
                      Rename
                    </button>
                  )}
                  
                  {showModal === 'newfolder' && (
                    <button className="btn primary" onClick={handleCreateFolder}>
                      Create
                    </button>
                  )}
                  
                  {showModal === 'delete' && (
                    <button className="btn danger" onClick={handleDelete}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {viewingImage && (
            <div className="modal-overlay" onClick={() => setViewingImage(null)}>
              <div className="image-viewer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="image-viewer-header">
                  <div className="image-viewer-info">
                    <h3>{viewingImage.name}</h3>
                    <span className="image-meta">{viewingImage.size} • {viewingImage.date}</span>
                  </div>
                  <div className="image-viewer-actions">
                    <button 
                      className="toolbar-btn"
                      onClick={() => {
                        setInputValue(viewingImage.name);
                        setContextMenuItem(viewingImage);
                        setShowModal('rename');
                        setViewingImage(null);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Rename
                    </button>
                    <button 
                      className="toolbar-btn"
                      onClick={() => handleDownload(viewingImage)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </button>
                    <button className="close-btn" onClick={() => setViewingImage(null)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="image-viewer-content">
                  {viewingImage.telegram_file_id ? (
                    <img 
                      src={`https://api.telegram.org/file/bot${import.meta.env.VITE_TG_BOT_TOKEN || '5946129966:AAF_da-ZBE7XKI8sy3HdkvOmq8d7kIvi7xY'}/${viewingImage.telegram_file_id}`}
                      alt={viewingImage.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(viewingImage.name)}`;
                      }}
                    />
                  ) : (
                    <img 
                      src={`https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(viewingImage.name)}`} 
                      alt={viewingImage.name}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </main>

      <footer className="app-footer">
        <p>© 2025 Tgridu File Manager - Premium Edition</p>
      </footer>
    </div>
  );
}

export default App;
