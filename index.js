const express = require('express')
const path = require('path')
const morgan = require('morgan')
const multer = require('multer')
const engine = require('ejs-layout')
const uuid = require('uuid')
const { format } = require('timeago.js')
//Initilizations
const app = express()
require('./database')

//Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine.__express)

//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename)  => {
        cb(null, uuid() + path.extname(file.originalname))
    }
})
app.use(multer({ storage: storage }).single('image'))
//Global variables
app.use((req, res, next) => {
    app.locals.format = format
    next()
})
//Routes
app.use(require('./routes/index'))
// static files
app.use(express.static(path.join(__dirname, 'public')))
//start server
app.listen(3000, () => {
    console.log(`Server on port ${app.get('port')}`)
})