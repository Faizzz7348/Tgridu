import { query } from '../database/db.js';
import telegramService from './telegram.js';
import { v4 as uuidv4 } from 'uuid';

class FileService {
  // Create or get user
  async getOrCreateUser(telegramId, userData = {}) {
    try {
      // Check if user exists
      let result = await query(
        'SELECT * FROM users WHERE telegram_id = $1',
        [telegramId]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // Create new user
      result = await query(
        `INSERT INTO users (telegram_id, username, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [telegramId, userData.username, userData.first_name, userData.last_name]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file, userId, folderId = null) {
    try {
      // Upload to Telegram
      const telegramData = await telegramService.uploadFile(
        file.path,
        file.originalname
      );

      // Save to database
      const result = await query(
        `INSERT INTO files (
          id, name, original_name, file_type, mime_type, size_bytes, size_display,
          folder_id, user_id, telegram_file_id, telegram_message_id, telegram_file_unique_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          uuidv4(),
          file.originalname,
          file.originalname,
          telegramData.file_type,
          telegramData.mime_type,
          telegramData.file_size,
          this.formatFileSize(telegramData.file_size),
          folderId,
          userId,
          telegramData.telegram_file_id,
          telegramData.telegram_message_id,
          telegramData.telegram_file_unique_id
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  // Get all files
  async getFiles(userId, folderId = null, options = {}) {
    try {
      const { search, sortBy = 'created_at', sortOrder = 'DESC', limit = 1000, offset = 0 } = options;

      let queryText = `
        SELECT * FROM files 
        WHERE user_id = $1 
        AND is_deleted = FALSE
      `;
      const params = [userId];
      let paramCount = 1;

      // Filter by folder
      if (folderId) {
        paramCount++;
        queryText += ` AND folder_id = $${paramCount}`;
        params.push(folderId);
      } else {
        queryText += ` AND folder_id IS NULL`;
      }

      // Search filter
      if (search) {
        paramCount++;
        queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      // Sorting
      const validSortFields = ['name', 'created_at', 'size_bytes', 'file_type'];
      const validSortOrders = ['ASC', 'DESC'];
      const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      queryText += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

      // Pagination
      paramCount++;
      queryText += ` LIMIT $${paramCount}`;
      params.push(limit);
      
      paramCount++;
      queryText += ` OFFSET $${paramCount}`;
      params.push(offset);

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      console.error('Error in getFiles:', error);
      throw error;
    }
  }

  // Get file by ID
  async getFileById(fileId, userId) {
    try {
      const result = await query(
        'SELECT * FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE',
        [fileId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in getFileById:', error);
      throw error;
    }
  }

  // Rename file
  async renameFile(fileId, userId, newName) {
    try {
      const result = await query(
        'UPDATE files SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
        [newName, fileId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in renameFile:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(fileId, userId) {
    try {
      // Get file info
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        throw new Error('File not found');
      }

      // Delete from Telegram
      await telegramService.deleteFile(file.telegram_message_id);

      // Soft delete from database
      await query(
        'UPDATE files SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
        [fileId]
      );

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      throw error;
    }
  }

  // Get download link
  async getDownloadLink(fileId, userId) {
    try {
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        throw new Error('File not found');
      }

      const link = await telegramService.getFileLink(file.telegram_file_id);
      return { link, file };
    } catch (error) {
      console.error('Error in getDownloadLink:', error);
      throw error;
    }
  }

  // Create folder
  async createFolder(name, userId, parentId = null) {
    try {
      const result = await query(
        'INSERT INTO folders (id, name, parent_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [uuidv4(), name, parentId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in createFolder:', error);
      throw error;
    }
  }

  // Get folders
  async getFolders(userId, parentId = null) {
    try {
      let queryText = 'SELECT * FROM folders WHERE user_id = $1';
      const params = [userId];

      if (parentId) {
        queryText += ' AND parent_id = $2';
        params.push(parentId);
      } else {
        queryText += ' AND parent_id IS NULL';
      }

      queryText += ' ORDER BY name ASC';

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      console.error('Error in getFolders:', error);
      throw error;
    }
  }

  // Delete folder
  async deleteFolder(folderId, userId) {
    try {
      // This will cascade delete all files and subfolders
      await query(
        'DELETE FROM folders WHERE id = $1 AND user_id = $2',
        [folderId, userId]
      );
      return true;
    } catch (error) {
      console.error('Error in deleteFolder:', error);
      throw error;
    }
  }

  // Helper: Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default new FileService();
