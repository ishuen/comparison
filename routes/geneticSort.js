var express = require('express')
var router = express.Router()
const geneticSort = require('../controllers/geneticSort')

router.get('/data', geneticSort.showData)
router.get('/path', geneticSort.showPath)
router.get('/procedure', geneticSort.showProcedure)

module.exports = router
