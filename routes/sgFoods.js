var express = require('express')
var router = express.Router()
const sgFoods = require('../controllers/sgFoods')

router.get('/data', sgFoods.showData)
router.get('/data/:meal', sgFoods.showByMeal)
router.get('/path/pareto/:meal', sgFoods.showPathByMealP)
router.get('/path/heuristic/:meal', sgFoods.showPathByMealH)

module.exports = router
