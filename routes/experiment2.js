var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId/:alg', experiments.showItemsExp2)
router.get('/:env/:trial/:userId/:alg', experiments.showItemsExp2Env)
router.post('/:trial/:userId', experiments.submitPicked)
router.post('/:env/:trial/:userId', experiments.submitPickedEnv)
module.exports = router
