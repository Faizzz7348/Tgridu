import express from 'express';
import multer from 'multer';
import fileService from '../services/fileService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // 2GB limit (Telegram limit)
  }
});

// Get all files
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId, search, sortBy, sortOrder, limit, offset } = req.query;

    const files = await fileService.getFiles(userId, folderId, {
      search,
      sortBy,
      sortOrder,
      limit: limit ? parseInt(limit) : 1000,
      offset: offset ? parseInt(offset) : 0
    });

    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch files',
      message: error.message
    });
  }
});

// Get file by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    const file = await fileService.getFileById(fileId, userId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file',
      message: error.message
    });
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const userId = req.user.id;
    const folderId = req.body.folderId || null;

    const file = await fileService.uploadFile(req.file, userId, folderId);

    res.json({
      success: true,
      data: file,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      message: error.message
    });
  }
});

// Rename file
router.patch('/:id/rename', async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'New name is required'
      });
    }

    const file = await fileService.renameFile(fileId, userId, name);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.json({
      success: true,
      data: file,
      message: 'File renamed successfully'
    });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rename file',
      message: error.message
    });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    await fileService.deleteFile(fileId, userId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
      message: error.message
    });
  }
});

// Get download link
router.get('/:id/download', async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    const { link, file } = await fileService.getDownloadLink(fileId, userId);

    res.json({
      success: true,
      data: {
        downloadUrl: link,
        file
      }
    });
  } catch (error) {
    console.error('Download link error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get download link',
      message: error.message
    });
  }
});

export default router;
