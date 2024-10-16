const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'proyecto10'
    if (req.body.folder) {
      folderName = req.body.folder
    }

    return {
      folder: folderName,
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
    }
  }
})
const upload = multer({ storage })
module.exports = upload
