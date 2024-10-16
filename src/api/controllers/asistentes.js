const Asistente = require('../models/asistentes')
const Evento = require('../models/evento')

const getAsistentes = async (req, res, next) => {
  try {
    const asistentes = await Asistente.find().populate('eventosConfirmados')
    return res.status(200).json(asistentes)
  } catch (error) {
    return res.status(400).json('Error al mostrar asistentes')
  }
}

const getAsistentesById = async (req, res, next) => {
  try {
    const { id } = req.params
    const asistente = await Asistente.findById(id).populate(
      'eventosConfirmados'
    )
    return res.status(200).json(asistente)
  } catch (error) {
    return res.status(400).json('error en el get id')
  }
}
const mongoose = require('mongoose')

const registrarAsistente = async (req, res, next) => {
  try {
    const { eventosConfirmados, nombre, email } = req.body

    let asistenteExistente = await Asistente.findOne({ email: email })

    if (asistenteExistente) {
      if (!asistenteExistente.eventosConfirmados) {
        asistenteExistente.eventosConfirmados = []
      }

      if (asistenteExistente.eventosConfirmados.includes(eventosConfirmados)) {
        return res
          .status(400)
          .json('El asistente ya está registrado para este evento')
      }

      asistenteExistente.eventosConfirmados.push(eventosConfirmados)
      await asistenteExistente.save()

      const evento = await Evento.findById(eventosConfirmados).populate(
        'asistentes'
      )

      if (!evento) {
        return res.status(400).json('Evento no encontrado')
      }

      if (!evento.asistentes.includes(asistenteExistente._id)) {
        evento.asistentes.push(asistenteExistente._id)
        await evento.save()
      }

      return res.status(200).json(asistenteExistente)
    }
    const newAsistente = new Asistente({
      nombre: nombre,
      email: email,
      confirmedEvents: [eventosConfirmados]
    })

    const asistente = await newAsistente.save()

    const evento = await Evento.findById(eventosConfirmados).populate(
      'asistentes'
    )
    if (!evento) {
      return res.status(400).json('Evento no encontrado')
    }

    evento.asistentes.push(asistente._id)
    await evento.save()

    await enviarCorreoConfirmacion(email, evento.nombre)

    return res.status(201).json(asistente)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al registrar el asistente')
  }
}

const deleteAsistente = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteAsistente = await Asistente.findByIdAndDelete(id)
    return res.status(200).json(deleteAsistente)
  } catch (error) {
    return res.status(400).json('error en el delete')
  }
}

module.exports = {
  getAsistentes,
  getAsistentesById,
  registrarAsistente,
  deleteAsistente
}
