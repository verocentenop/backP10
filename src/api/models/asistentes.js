const mongoose = require('mongoose')

const asistenteSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    eventosConfirmados: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'eventos'
      }
    ]
  },
  { timestamps: true, collection: 'asistentes' }
)

const Asistente = mongoose.model('asistentes', asistenteSchema, 'asistentes')
module.exports = Asistente
