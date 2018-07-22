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
      if (res.rows[0]['user_id'] % 2 === 0) {
        pool.query('UPDATE user_data SET exp_group = $1', [1], (err, res) => {
          if (err) throw err
        })
      } else {
        pool.query('UPDATE user_data SET exp_group = $1', [2], (err, res) => {
          if (err) throw err
        })
      }
      callback(res.rows[0]['user_id'])
    })
  }
  getUserGroup (userId, callback) {
    pool.query('SELECT * FROM user_data WHERE user_id = $1', [userId], (err, res) => {
      if (err) throw err
      callback(res.rows[0]['exp_group'])
    })
  }
  checkGroup (userId, expNum, callback) {
    if ((userId % 2 === 0 && expNum === 2) || (userId % 2 === 1 && expNum === 1)) {
      pool.query('UPDATE user_data SET exp_group = $1 WHERE user_id = $2', ['both', userId], (err, res) => {
        if (err) throw err
      })
    }
  }
}

module.exports = new Survey1()
