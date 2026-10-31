// folders.service.js
const foldersRepo = require('./folders.repository');

class FoldersService {
  async getUserFolders(userId) {
    return foldersRepo.findByUser(userId);
  }

  async createFolder(userId, { name, color }) {
    if (!name || !name.trim()) {
      const err = new Error('Folder name is required');
      err.statusCode = 400;
      throw err;
    }
    return foldersRepo.create({ userId, name: name.trim(), color: color || '#3B82F6' });
  }

  async deleteFolder(id, userId) {
    const deleted = await foldersRepo.delete(id, userId);
    if (!deleted) {
      const err = new Error('Folder not found');
      err.statusCode = 404;
      throw err;
    }
    return { id };
  }
}

module.exports = new FoldersService();

