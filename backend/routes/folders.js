import express from 'express';
import fileService from '../services/fileService.js';

const router = express.Router();

// Get all folders
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { parentId } = req.query;

    const folders = await fileService.getFolders(userId, parentId);

    res.json({
      success: true,
      data: folders,
      count: folders.length
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch folders',
      message: error.message
    });
  }
});

// Create folder
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Folder name is required'
      });
    }

    const folder = await fileService.createFolder(name, userId, parentId);

    res.json({
      success: true,
      data: folder,
      message: 'Folder created successfully'
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create folder',
      message: error.message
    });
  }
});

// Delete folder
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const folderId = req.params.id;

    await fileService.deleteFolder(folderId, userId);

    res.json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete folder',
      message: error.message
    });
  }
});

export default router;
