var express = require('express')
var router = express.Router()
const behavioralRank = require('../controllers/behavioralRank')

router.get('/path/random/:number', behavioralRank.randomPath)
router.get('/path/select/:number/:itemId', behavioralRank.showPath)

module.exports = router
