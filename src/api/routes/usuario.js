const { isAuth } = require('../../middlewares/auth')
const upload = require('../../middlewares/file')

const {
  getUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  registro,
  login
} = require('../controllers/usuario')

const usuariosRouter = require('express').Router()

usuariosRouter.get('/', getUsuario)
usuariosRouter.get('/:id', getUsuarioById)
usuariosRouter.post('/registro', upload.single('imagen'), registro)
usuariosRouter.post('/login', login)
usuariosRouter.put('/:id', upload.single('imagen'), isAuth, updateUsuario)
usuariosRouter.delete('/:id', deleteUsuario)

module.exports = usuariosRouter
