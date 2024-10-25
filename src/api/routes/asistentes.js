const { isAuth } = require('../../middlewares/auth')
const {
  getAsistentes,
  getAsistentesById,
  registrarAsistente,
  deleteAsistente
} = require('../controllers/asistentes')

const asistentesRouter = require('express').Router()

asistentesRouter.get('/', getAsistentes)
asistentesRouter.get('/:id', getAsistentesById)
asistentesRouter.post('/:id', isAuth, registrarAsistente)
asistentesRouter.delete('/:id', isAuth, deleteAsistente)

module.exports = asistentesRouter
