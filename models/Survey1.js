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
}

module.exports = new Survey1()
