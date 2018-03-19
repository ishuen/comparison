var express = require('express')
var router = express.Router()
const paretoFrontier = require('../controllers/paretoFrontier')

router.get('/path/:number', paretoFrontier.showPath)

module.exports = router
