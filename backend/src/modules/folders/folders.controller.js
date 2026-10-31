// folders.controller.js
const foldersService = require('./folders.service');
const { success } = require('../../utils/response');

class FoldersController {
  async getAll(req, res, next) {
    try {
      const folders = await foldersService.getUserFolders(req.user.id);
      return success(res, folders, 200);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const folder = await foldersService.createFolder(req.user.id, req.body);
      return success(res, folder, 201);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await foldersService.deleteFolder(req.params.id, req.user.id);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FoldersController();

