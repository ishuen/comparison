var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:itemOrder', surveys.showQuestionsModValue)
router.post('/:trial/:itemOrder', surveys.scoreSubmit)
module.exports = router
