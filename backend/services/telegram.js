import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Initialize Telegram Bot with error handling
let bot;
try {
  if (!process.env.TG_BOT_TOKEN) {
    console.warn('⚠️  TG_BOT_TOKEN not found in environment variables');
  }
  bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: false });
  console.log('✅ Telegram Bot initialized');
} catch (error) {
  console.error('❌ Failed to initialize Telegram Bot:', error.message);
  console.warn('⚠️  Server will start but file uploads will not work');
}

const CHANNEL_ID = process.env.CHANNEL_ID;
const OWNER_ID = process.env.OWNER_ID;

// Helper to get file type
const getFileType = (filename, mimeType) => {
  const ext = path.extname(filename).toLowerCase();
  
  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType?.startsWith('video/')) return 'video';
  if (mimeType?.startsWith('audio/')) return 'audio';
  
  const typeMap = {
    '.pdf': 'pdf',
    '.doc': 'document',
    '.docx': 'document',
    '.txt': 'document',
    '.xls': 'document',
    '.xlsx': 'document',
    '.ppt': 'document',
    '.pptx': 'document',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.png': 'image',
    '.gif': 'image',
    '.webp': 'image',
    '.mp4': 'video',
    '.avi': 'video',
    '.mov': 'video',
    '.mkv': 'video',
    '.mp3': 'audio',
    '.wav': 'audio',
    '.ogg': 'audio',
    '.js': 'code',
    '.jsx': 'code',
    '.html': 'code',
    '.css': 'code',
    '.json': 'code',
    '.py': 'code',
    '.zip': 'archive',
    '.rar': 'archive',
    '.7z': 'archive',
    '.tar': 'archive',
    '.gz': 'archive'
  };
  
  return typeMap[ext] || 'document';
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

class TelegramService {
  constructor() {
    this.bot = bot;
    this.channelId = CHANNEL_ID;
    this.ownerId = OWNER_ID;
  }

  // Upload file to Telegram channel
  async uploadFile(filePath, originalName, caption = '') {
    try {
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      
      // Create caption with metadata
      const metadata = {
        name: originalName,
        size: formatFileSize(fileSize),
        uploadedAt: new Date().toISOString()
      };
      
      const fullCaption = caption 
        ? `${caption}\n\n📊 ${JSON.stringify(metadata)}`
        : `📊 ${JSON.stringify(metadata)}`;

      // Send file to channel
      const message = await this.bot.sendDocument(
        this.channelId,
        filePath,
        {
          caption: fullCaption,
          parse_mode: 'HTML'
        }
      );

      // Delete local file after upload
      fs.unlinkSync(filePath);

      return {
        telegram_file_id: message.document.file_id,
        telegram_message_id: message.message_id,
        telegram_file_unique_id: message.document.file_unique_id,
        file_name: message.document.file_name,
        mime_type: message.document.mime_type,
        file_size: message.document.file_size,
        file_type: getFileType(originalName, message.document.mime_type)
      };
    } catch (error) {
      console.error('❌ Telegram upload error:', error);
      throw new Error(`Failed to upload to Telegram: ${error.message}`);
    }
  }

  // Get file download link
  async getFileLink(fileId) {
    try {
      const file = await this.bot.getFile(fileId);
      return `https://api.telegram.org/file/bot${process.env.TG_BOT_TOKEN}/${file.file_path}`;
    } catch (error) {
      console.error('❌ Get file link error:', error);
      throw new Error(`Failed to get file link: ${error.message}`);
    }
  }

  // Download file from Telegram
  async downloadFile(fileId, downloadPath) {
    try {
      const fileLink = await this.getFileLink(fileId);
      const file = await this.bot.downloadFile(fileId, downloadPath);
      return file;
    } catch (error) {
      console.error('❌ Download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  // Delete file from Telegram channel
  async deleteFile(messageId) {
    try {
      await this.bot.deleteMessage(this.channelId, messageId);
      return true;
    } catch (error) {
      console.error('❌ Delete error:', error);
      // Don't throw error if message is already deleted
      if (error.message.includes('message to delete not found')) {
        return true;
      }
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Edit file caption (for rename)
  async updateFileCaption(messageId, newCaption) {
    try {
      await this.bot.editMessageCaption(newCaption, {
        chat_id: this.channelId,
        message_id: messageId,
        parse_mode: 'HTML'
      });
      return true;
    } catch (error) {
      console.error('❌ Update caption error:', error);
      throw new Error(`Failed to update caption: ${error.message}`);
    }
  }

  // Send notification to owner
  async notifyOwner(message) {
    try {
      await this.bot.sendMessage(this.ownerId, message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('❌ Notification error:', error);
    }
  }
}

export default new TelegramService();
