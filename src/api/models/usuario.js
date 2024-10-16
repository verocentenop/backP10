const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const usuarioSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    edad: { type: String, required: true },
    imagen: { type: String, required: true },
    favoritos: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'eventos' }
    ],
    rol: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true, collection: 'usuarios' }
)

usuarioSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const Usuario = mongoose.model('usuarios', usuarioSchema, 'usuarios')
module.exports = Usuario
