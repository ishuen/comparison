var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:itemOrder/:userId', surveys.showQuestions)
router.post('/:trial/:itemOrder/:userId', surveys.agreementSubmit)
module.exports = router
