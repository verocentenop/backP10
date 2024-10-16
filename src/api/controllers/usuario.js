const { deleteFile } = require('../../utils/deleteFile')
const { generarLlave } = require('../../utils/jwt')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
deleteFile

const getUsuario = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().populate('favoritos')
    return res.status(200).json(usuarios)
  } catch (error) {
    return res.status(400).json('error en el get')
  }
}
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params
    const usuario = await Usuario.findById(id).populate('favoritos')
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(400).json('error en el get id')
  }
}
const registro = async (req, res, next) => {
  try {
    const usuarioDuplicado = await Usuario.findOne({
      userName: req.body.userName
    })
    if (usuarioDuplicado) {
      return res.status(400).json('Nombre de usuario no disponible')
    }
    const newUsuario = new Usuario({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      edad: req.body.edad,
      rol: 'user'
    })
    if (req.file) {
      newUsuario.imagen = req.file.path
    }
    const usuario = await newUsuario.save()
    return res.status(200).json(usuario)
  } catch (error) {
    console.log(error)
    console.log(error)
    return res.status(400).json('error en registro')
  }
}
const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body
    const usuario = await Usuario.findOne({ userName })
    if (!usuario) {
      return res.status(400).json('Usuario o contraseña incorrectos')
    }

    if (bcrypt.compareSync(password, usuario.password)) {
      const token = generarLlave(usuario._id)
      return res.status(200).json({ token, usuario })
    }
    return res.status(400).json('Usuario o contraseña incorrectos')
  } catch (error) {
    console.log(error)
    return res.status(400).json('error en login')
  }
}

const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    if (req.usuario._id.toString() !== id) {
      return res.status(400).json('No puedes modificar otros usuarios')
    }
    const oldUsuario = await Usuario.findById(id)
    const newUsuario = new Usuario(req.body)
    newUsuario._id = id

    if (req.body.favoritos) {
      newUsuario.favoritos = [
        ...new Set([...oldUsuario.favoritos, ...req.body.favoritos])
      ]
    }

    if (req.file) {
      deleteFile(oldUsuario.imagen)
      newUsuario.imagen = req.file.path
    } else {
      newUsuario.imagen = oldUsuario.imagen
    }

    const usuarioUpdated = await Usuario.findByIdAndUpdate(id, newUsuario, {
      new: true
    })

    return res.status(200).json(usuarioUpdated)
  } catch (error) {
    console.log(error)
    return res.status(400).json('error en el update')
  }
}
const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteUsuario = await Usuario.findByIdAndDelete(id)
    return res.status(200).json(deleteUsuario)
  } catch (error) {
    return res.status(400).json('error en el delete')
  }
}

module.exports = {
  getUsuario,
  getUsuarioById,
  registro,
  login,
  updateUsuario,
  deleteUsuario
}
