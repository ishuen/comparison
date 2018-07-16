var express = require('express')
var router = express.Router()
const paretoFrontier = require('../controllers/mobile')

router.get('/path/:number', paretoFrontier.showPath)
router.get('/trad/:number', paretoFrontier.traditionalPath)
router.get('/relaxed/:number', paretoFrontier.relaxedPath)
router.get('/heu/:number', paretoFrontier.showPathHeuristic)
module.exports = router
