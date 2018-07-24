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
      if (res.rows[0]['user_id'] % 8 === 0) {
        pool.query('UPDATE user_data SET exp_group = $1', [1], (err, res) => {
          if (err) throw err
        })
      } else {
        let conditions = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
        let input = '2' + conditions[res.rows[0]['user_id'] % 8 - 1]
        pool.query('UPDATE user_data SET exp_group = $1', [input], (err, res) => {
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
    if (userId % 8 === 0 && expNum === 2) {
      let num = (userId / 8) % 7
      let conditions = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      let input = 'both12' + conditions[num]
      pool.query('UPDATE user_data SET exp_group = $1 WHERE user_id = $2', [input, userId], (err, res) => {
        if (err) throw err
      })
    } else if (userId % 8 !== 0 && expNum === 1) {
      pool.query('SELECT * FROM user_data WHERE user_id = $1', [userId], (err, res) => {
        if (err) throw err
        let group = res.rows[0]['exp_group']
        let input = 'both1' + group
        pool.query('UPDATE user_data SET exp_group = $1 WHERE user_id = $2', [input, userId], (err, res) => {
          if (err) throw err
        })
      })
    }
  }
}

module.exports = new Survey1()
