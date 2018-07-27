var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

// router.get('/:trial/:itemOrder/:userId', surveys.showQuestions)
// router.post('/:trial/:itemOrder/:userId', surveys.agreementSubmit)
router.get('/:trial/:userId', surveys.allAgreementQns)
router.post('/:trial/:userId', surveys.allAgreementSubmit)

module.exports = router
