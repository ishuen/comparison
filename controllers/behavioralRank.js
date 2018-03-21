const BehavioralRank = require('../models/HpbData')
const _ = require('lodash')
class BehavioralRankController {
  /**
  * @api {get} /behavioralRank/path/:number Request the ranking based on behavior theories
  * @apiName ShowPathBehavioral
  * @apiGroup Behavioral
  *
  * @apiParam {Number} number the size of set to rank
  *
  * @apiSuccess {Object[]} data ranking result
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *   "data": [
  *     {
  *       "id": "128",
  *       "Energy_kcal%": "11.865",
  *       "Carbohydrate_g%": "5.766666667",
  *       "Protein_g%": "5.333333333",
  *       "Totalfat_g%": "26.40625",
  *       "Saturatedfat_g%": "52.25",
  *       "Dietaryfibre_g%": "2.4",
  *       "Cholestrol_mg%": "37.33333333",
  *       "Sodium_mg%": "6.645833333",
  *       "RRR'": "0.167872317",
  *       "T'": "13.37493687",
  *       "T'c": "1.039637534",
  *       "RRR": "0.143085119",
  *       "TOri": "0.252956144"
  *     },
  *     {
  *       "id": "1545",
  *       "Energy_kcal%": "10.804",
  *       "Carbohydrate_g%": "8.64",
  *       "Protein_g%": "3.306666667",
  *       "Totalfat_g%": "17.796875",
  *       "Saturatedfat_g%": "26.5",
  *       "Dietaryfibre_g%": "6.12",
  *       "Cholestrol_mg%": "3.65",
  *       "Sodium_mg%": "6.782916667",
  *       "RRR'": "0.40910085",
  *       "T'": "11.48296086",
  *       "T'c": "0.972802513",
  *       "RRR": "0.394942419",
  *       "TOri": "0.170483461"
  *     },
  *     {
  *       "id": "395",
  *       "Energy_kcal%": "1.8915",
  *       "Carbohydrate_g%": "0.03",
  *       "Protein_g%": "3.906666667",
  *       "Totalfat_g%": "4.4375",
  *       "Saturatedfat_g%": "6.3",
  *       "Dietaryfibre_g%": "0",
  *       "Cholestrol_mg%": "5.436666667",
  *       "Sodium_mg%": "2.131666667",
  *       "RRR'": "0.581606754",
  *       "T'": "2.533964646",
  *       "T'c": "0.876349523",
  *       "RRR": "0.495775125",
  *       "TOri": "0.042508606"
  *     },
  *     {
  *       "id": "2365",
  *       "Energy_kcal%": "4.16",
  *       "Carbohydrate_g%": "1.42",
  *       "Protein_g%": "15.66666667",
  *       "Totalfat_g%": "3.25",
  *       "Saturatedfat_g%": "5.2",
  *       "Dietaryfibre_g%": "7.92",
  *       "Cholestrol_mg%": "0",
  *       "Sodium_mg%": "13.26",
  *       "RRR'": "2.411814283",
  *       "T'": "6.113030303",
  *       "T'c": "1.184695795",
  *       "RRR": "2.085470085",
  *       "TOri": "0.031133064"
  *     }
  *   ],
  *   "defaultPoint": {
  *     "id": "395",
  *     "Energy_kcal%": "1.8915",
  *     "Carbohydrate_g%": "0.03",
  *     "Protein_g%": "3.906666667",
  *     "Totalfat_g%": "4.4375",
  *     "Saturatedfat_g%": "6.3",
  *     "Dietaryfibre_g%": "0",
  *     "Cholestrol_mg%": "5.436666667",
  *     "Sodium_mg%": "2.131666667",
  *     "RRR'": "0.581606754",
  *     "T'": "2.533964646",
  *     "T'c": "0.876349523",
  *     "RRR": "0.495775125",
  *     "TOri": "0.042508606"
  *   }
  * }
  */
  showPath (req, res) {
    const number = req.params.number
    let data = BehavioralRank.randomData(number)
    const defaultPoint = _.sample(data)
    data = _.filter(data, function (o) { return o['T\'c'] >= defaultPoint['T\'c'] })
    const obj = groupData(data, defaultPoint)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    tGroup = _.sortBy(tGroup, [function (o) { return o['T\'c'] }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return o['RRR\''] }])
    let resData = tGroup.concat(hGroup)
    res.send({data: resData, defaultPoint: defaultPoint})
  }
}

module.exports = new BehavioralRankController()

function groupData (data, mid) {
  let tGroup = []
  let hGroup = []
  for (let item of data) {
    if (item['RRR\''] >= mid['RRR\'']) {
      hGroup.push(item)
    } else {
      tGroup.push(item)
    }
  }
  let obj = {
    tGroup: tGroup,
    hGroup: hGroup
  }
  return obj
}