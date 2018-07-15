var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId/:alg', experiments.showItemsExp2)
router.post('/:trial/:userId', experiments.submitPicked)
module.exports = router
