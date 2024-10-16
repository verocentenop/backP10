const Evento = require('../models/evento')
const { deleteFile } = require('../../utils/deleteFile')

const getEvento = async (req, res, next) => {
  try {
    const eventos = await Evento.find().populate('asistentes')
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error en el get')
  }
}

const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const eventos = await Evento.findById(id).populate('asistentes')
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error en el get id')
  }
}

const getEventoByFecha = async (req, res, next) => {
  try {
    const { year, month } = req.params
    const startDate = new Date(`${year}-${month}-01`)
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      1
    )
    const eventos = await Evento.find({
      fecha: {
        $gte: startDate,
        $lt: endDate
      }
    })
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error en el get fecha')
  }
}

const getEventoByUbicacion = async (req, res, next) => {
  try {
    const { ciudad } = req.params
    const eventos = await Evento.find({
      ubicacion: { $regex: new RegExp(ciudad, 'i') }
    })
    return res.status(200).json(eventos)
  } catch (error) {
    console.log(error)
    return res.status(400).json('error en el get ubi')
  }
}

const getEventoByCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params
    const eventos = await Evento.find({ categoria: categoria })
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error en el get cate')
  }
}
const postEvento = async (req, res, next) => {
  try {
    const newEvento = new Evento(req.body)
    if (req.file) {
      newEvento.imagen = req.file.path
    }
    const evento = await newEvento.save()
    return res.status(201).json(evento)
  } catch (error) {
    console.log(error)
    return res.status(400).json('error en el post')
  }
}
const updateEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const newEvento = new Evento(req.body)
    newEvento._id = id
    const eventoUpdated = await Evento.findByIdAndUpdate(id, newEvento, {
      new: true
    })
    return res.status(200).json(eventoUpdated)
  } catch (error) {
    return res.status(400).json('error en el update')
  }
}
const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteEvento = await Evento.findByIdAndDelete(id)
    deleteFile(deleteEvento.imagen)
    return res.status(200).json(deleteEvento)
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

module.exports = {
  getEvento,
  getEventoById,
  getEventoByCategoria,
  getEventoByFecha,
  getEventoByUbicacion,
  updateEvento,
  postEvento,
  deleteEvento
}
