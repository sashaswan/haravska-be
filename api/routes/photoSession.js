const publicRouter = require('express').Router();
const privateRouter = require('express').Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove
} = require('../controllers/photoSession');

publicRouter.get('/', getAll);
publicRouter.get('/:id', getOne);
privateRouter.post('/', create);
privateRouter.put('/:id', update);
privateRouter.delete('/:id', remove);

module.exports = {
  publicRouter,
  privateRouter,
};