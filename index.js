require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const usuariosRouter = require('./src/api/routes/usuario')
const eventosRouter = require('./src/api/routes/evento')
const asistentesRouter = require('./src/api/routes/asistentes')
const cloudinary = require('cloudinary').v2
const cors = require('cors')

const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

connectDB()
app.use(cors())
app.use(express.json())

app.use('/api/v1/eventos', eventosRouter)
app.use('/api/v1/usuarios', usuariosRouter)
app.use('/api/v1/asistentes', asistentesRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
