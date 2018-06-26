var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:itemOrder', surveys.showQuestions)
router.post('/:trial/:itemOrder', surveys.agreementSubmit)
module.exports = router
