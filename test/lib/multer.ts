import multer from 'multer'
import path from 'path'
import { RequestHandler } from 'express'

const { diskStorage } = multer
const filetypes = /jpeg|jpg|png|gif/
const destination = './src/public/uploads/'

const storage = diskStorage({
  destination,
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}`)
  },
})

const upload = multer({
  storage,
  //   limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) return cb(null, true)

    return cb(new Error('Error: Images Only!'))
  },
}).single('file')

export default upload
