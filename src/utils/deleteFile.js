const cloudinary = require('cloudinary').v2

const deleteFile = (url) => {
  const imagenSplited = url.split('/')

  const folderName = imagenSplited.at(-2)
  const fileName = imagenSplited.at(-1).split('.')[0]

  cloudinary.uploader.destroy(`${folderName}/${fileName}`, () => {
    console.log('imagen eliminada')
  })
}
module.exports = { deleteFile }
