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
    const { eventosConfirmados, userName } = req.body

    let asistenteExistente = await Asistente.findOne({ userName: userName })

    const evento = await Evento.findById(eventosConfirmados).populate(
      'asistentes'
    )

    if (!evento) {
      return res.status(400).json('Evento no encontrado')
    }

    if (evento.asistentes.length >= evento.capacidad) {
      return res.status(400).json('El evento está lleno')
    }

    if (asistenteExistente) {
      if (!asistenteExistente.eventosConfirmados) {
        asistenteExistente.eventosConfirmados = []
      }

      if (asistenteExistente.eventosConfirmados.includes(eventosConfirmados)) {
        return res.status(400).json('Ya estás registrado en este evento')
      }

      asistenteExistente.eventosConfirmados.push(eventosConfirmados)
      await asistenteExistente.save()

      if (!evento.asistentes.includes(asistenteExistente._id)) {
        evento.asistentes.push(asistenteExistente._id)
        await evento.save()
      }

      return res.status(200).json({
        asistenteExistente,
        asistentesEvento: evento.asistentes.length,
        capacidadMaxima: evento.capacidad
      })
    }
    const newAsistente = new Asistente({
      userName: userName,
      confirmedEvents: [eventosConfirmados]
    })

    const asistente = await newAsistente.save()

    evento.asistentes.push(asistente._id)
    await evento.save()

    return res.status(201).json({
      asistente,
      asistentesEvento: evento.asistentes.length,
      capacidadMaxima: evento.capacidad
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al registrar el asistente')
  }
}

const deleteAsistente = async (req, res) => {
  try {
    const { eventosConfirmados, userName } = req.body

    let asistenteExistente = await Asistente.findOne({ userName })

    if (!asistenteExistente) {
      return res.status(404).json('Usuario no encontrado')
    }

    const evento = await Evento.findById(eventosConfirmados).populate(
      'asistentes'
    )

    if (!evento) {
      return res.status(400).json('Evento no encontrado')
    }

    evento.asistentes = evento.asistentes.filter(
      (id) => id.toString() !== asistenteExistente._id.toString()
    )
    await evento.save()

    asistenteExistente.eventosConfirmados =
      asistenteExistente.eventosConfirmados.filter(
        (id) => id.toString() !== eventosConfirmados
      )
    await asistenteExistente.save()

    return res.status(200).json({
      message: 'Has salido del evento',
      asistentesEvento: evento.asistentes.length,
      capacidadMaxima: evento.capacidad
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al eliminar asistente del evento')
  }
}

module.exports = {
  getAsistentes,
  getAsistentesById,
  registrarAsistente,
  deleteAsistente
}
