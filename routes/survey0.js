var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:userId', surveys.showDietaryConstraint)
router.post('/:userId', surveys.dietSubmit)
module.exports = router
