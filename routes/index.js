const { Router } = require('express')
const router = Router();

const path = require('path')
const { unlink } = require('fs-extra')

const Image = require('../models/Image')

router.get('/', async (req, res) => {
    const images = await Image.find()
    res.render('home/home', { images })  
})

router.get('/upload', (req, res) => {
    res.render('images/upload')
})

router.post('/upload', async (req, res) => {
    console.log(req.file);
    const image = new Image()
    image.title = req.body.title
    image.description = req.body.description
    image.filename = req.file.filename
    image.path = '/img/uploads/' + req.file.filename
    image.originalname = req.file.originalname
    image.mimetype = req.file.mimetype
    image.size = req.file.size

    await image.save()
    res.redirect('/')
})

router.get('/image/:id', async (req, res) => {
    const { id } = req.params
    const image = await Image.findById(id)
    console.log(image)
    res.render('images/show', { image })
})

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params
    const image = await Image.findByIdAndDelete(id)
    unlink(path.resolve('./public' + image.path))
    res.redirect('/')
})

module.exports = router;