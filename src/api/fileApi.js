import { buildURL, getAuthHeaders } from './config';

/**
 * Fetch all files and folders
 */
export const fetchFiles = async (folderId = null) => {
  try {
    const url = folderId 
      ? buildURL(`/api/files?folder_id=${folderId}`)
      : buildURL('/api/files');
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

/**
 * Upload files to Telegram
 */
export const uploadFiles = async (files, folderId = null) => {
  try {
    const formData = new FormData();
    
    // Add files to form data
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    // Add folder ID if specified
    if (folderId) {
      formData.append('folder_id', folderId);
    }
    
    const response = await fetch(buildURL('/api/files/upload'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Rename a file
 */
export const renameFile = async (fileId, newName) => {
  try {
    const response = await fetch(buildURL(`/api/files/${fileId}/rename`), {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
    
    if (!response.ok) {
      throw new Error(`Rename failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(buildURL(`/api/files/${fileId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 */
export const getDownloadURL = async (fileId) => {
  try {
    const response = await fetch(buildURL(`/api/files/${fileId}/download`), {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get download URL: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

/**
 * Fetch all folders
 */
export const fetchFolders = async () => {
  try {
    const response = await fetch(buildURL('/api/folders'), {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

/**
 * Create a new folder
 */
export const createFolder = async (name, parentId = null) => {
  try {
    const response = await fetch(buildURL('/api/folders'), {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name, 
        parent_id: parentId 
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * Delete a folder
 */
export const deleteFolder = async (folderId) => {
  try {
    const response = await fetch(buildURL(`/api/folders/${folderId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete folder: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};
