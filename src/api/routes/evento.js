const { isAuth } = require('../../middlewares/auth')
const upload = require('../../middlewares/file')
const {
  getEvento,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento,
  getEventoByCategoria,
  getEventoByFecha,
  getEventoByUbicacion
} = require('../controllers/evento')

const eventosRouter = require('express').Router()

eventosRouter.get('/', getEvento)
eventosRouter.get('/:id', getEventoById)
eventosRouter.get('/categoria/:categoria', getEventoByCategoria)
eventosRouter.get('/fecha/:year/:month', getEventoByFecha)
eventosRouter.get('/ubicacion/:ciudad', getEventoByUbicacion)
eventosRouter.post('/', isAuth, upload.single('imagen'), postEvento)
eventosRouter.put('/:id', isAuth, updateEvento)
eventosRouter.delete('/:id', isAuth, deleteEvento)

module.exports = eventosRouter
