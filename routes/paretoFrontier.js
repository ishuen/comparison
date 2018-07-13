var express = require('express')
var router = express.Router()
const paretoFrontier = require('../controllers/paretoFrontier')

// router.get('/path/:number', paretoFrontier.showPath)
router.get('/path/:number', paretoFrontier.relaxedPath)
router.get('/traditionalPath/:number', paretoFrontier.traditionalPath)

module.exports = router
