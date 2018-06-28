const pool = require('../db')
class Experiments {
  addUserDefinedScores (obj, callback) {
    pool.query('INSERT INTO sorting_experiment (food_id, new_health, new_taste, user_id, trial_num) VALUES ($1, $2, $3, $4, $5) RETURNING exp_id', [obj.food_id, obj.new_health, obj.new_taste, obj.user_id, obj.trial_num], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  insertQnAns (arr, callback) {
    console.log(arr)
    let qnId = arr.map(x => x[0])
    // select all questions about to answer from survey_questions
    pool.query('SELECT * FROM survey_questions WHERE qn_id = ANY($1::integer[])', [qnId], (err, res) => {
      if (err) throw err
      // check the ans type and divide into 2
      let allQns = res.rows
      console.log(allQns)
      let likert = arr.filter(function (q) {
        let qn = allQns.find(function (p) {
          return Number(p.qn_id) === Number(q[0])
        })
        return qn.ans_type === '5_scale'
      })
      let comment = arr.filter(function (q) { return !likert.includes(q) })
      // insert into rating
      for (let rating of likert) {
        pool.query('INSERT INTO user_rating (qn_id, user_id, rating, trial, item_order) VALUES ($1, $2, $3, $4, $5)', [rating[0], rating[1], rating[2], rating[3], rating[4]], (err, res) => { if (err) throw err })
      }
      // insert into comment
      for (let co of comment) {
        pool.query('INSERT INTO user_comment (qn_id, user_id, description, trial, item_order) VALUES ($1, $2, $3, $4, $5)', [co[0], co[1], co[2], co[3], co[4]], (err, res) => { if (err) throw err })
      }
      callback(res.rows)
    })
  }
}
module.exports = new Experiments()
