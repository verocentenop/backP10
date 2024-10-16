const { verifyJwt } = require('../utils/jwt')
const Usuario = require('../api/models/usuario')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const parsedToken = token.replace('Bearer ', '')

    const { id } = verifyJwt(parsedToken)
    const usuario = await Usuario.findById(id)
    usuario.password = null
    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(400).json('no estás autorizado')
  }
}

module.exports = { isAuth }
