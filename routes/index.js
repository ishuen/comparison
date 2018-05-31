var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.use('/topologicalSort', require('./topologicalSort'))
router.use('/geneticSort', require('./geneticSort'))
router.use('/paretoFrontier', require('./paretoFrontier'))
router.use('/behavioralRank', require('./behavioralRank'))
router.use('/survey1', require('./survey1'))
router.use('/35SgFoods', require('./sgFoods'))

module.exports = router
