var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial', experiments.showItems)
router.post('/:trial', experiments.submitSorting)
module.exports = router
