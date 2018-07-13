const pool = require('../db')
class Survey1 {
  // constructor () {

  // }

  getQnSet (setNum, callback) {
    pool.query('SELECT * FROM survey_questions WHERE qn_set = $1', [setNum], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getQnSets (setNum, callback) {
    pool.query('SELECT * FROM survey_questions WHERE qn_set = $1 or qn_set = $2', [setNum[0], setNum[1]], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getNewId (callback) {
    pool.query('INSERT INTO user_data (age) VALUES ($1) RETURNING user_id', [0], (err, res) => {
      if (err) throw err
      callback(res.rows[0]['user_id'])
    })
  }
}

module.exports = new Survey1()
