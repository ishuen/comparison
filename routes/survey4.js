var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showQnPost1)
router.post('/:trial/:userId', surveys.post1Submit)
module.exports = router
