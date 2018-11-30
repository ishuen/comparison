var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:env/:userId', surveys.showDietaryConstraintEnv)
router.post('/:env/:userId', surveys.dietSubmitEnv)

module.exports = router
