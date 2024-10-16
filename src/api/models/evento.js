const mongoose = require('mongoose')

const eventoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    informacion: { type: String, required: true },
    imagen: { type: String, required: true },
    ubicacion: { type: String, required: true },
    capacidad: { type: Number, required: true },
    asistentes: [{ type: mongoose.Types.ObjectId, ref: 'asistentes' }],
    categoria: {
      type: String,
      required: true,
      enum: [
        'Padel',
        'Futbol',
        'Kikingball',
        'Rugby',
        'Tenis',
        'Volleyball',
        'PingPong',
        'Senderismo'
      ]
    }
  },
  { timestamps: true, collection: 'eventos' }
)

const Evento = mongoose.model('eventos', eventoSchema, 'eventos')
module.exports = Evento
