var express = require('express')
var router = express.Router()
const sgFoods = require('../controllers/sgFoods')

router.get('/data', sgFoods.showData)
router.get('/data/:meal', sgFoods.showByMeal)
router.get('/path/:meal', sgFoods.showPathByMeal)

module.exports = router
