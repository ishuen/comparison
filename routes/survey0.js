var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:userId', surveys.showDietaryConstraint)
router.get('/:env/:userId', surveys.showDietaryConstraintEnv)
router.post('/:userId', surveys.dietSubmit)
router.post('/:env/:userId', surveys.dietSubmitEnv)

module.exports = router
