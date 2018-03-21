var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.use('/topologicalSort', require('./topologicalSort'))

/* Genetic Algorithm */
router.use('/geneticSort', require('./geneticSort'))

router.use('/paretoFrontier', require('./paretoFrontier'))
router.use('/behavioralRank', require('./behavioralRank'))

module.exports = router
