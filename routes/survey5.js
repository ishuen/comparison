var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showQnPost2)
router.post('/:trial/:userId', surveys.post2Submit)
module.exports = router
