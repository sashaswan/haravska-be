const publicRouter = require('express').Router();
const privateRouter = require('express').Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove
} = require('../controllers/category');

publicRouter.get('/', getAll);
publicRouter.get('/:query', getOne);
privateRouter.post('/', create);
privateRouter.put('/:id', update);
privateRouter.delete('/:id', remove);

module.exports = {
  publicRouter,
  privateRouter,
};