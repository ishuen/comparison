const pool = require('../db')
const _ = require('lodash')
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
      pool.query('SELECT * FROM user_data WHERE user_id = $1', [userId], (err, res) => {
        if (err) throw err
        let group = res.rows[0]['exp_group']
        if (group.length > 2) return
        let input = 'both12' + conditions[num]
        pool.query('UPDATE user_data SET exp_group = $1 WHERE user_id = $2', [input, userId], (err, res) => {
          if (err) throw err
        })
      })
    } else if (userId % 8 !== 0 && expNum === 1) {
      pool.query('SELECT * FROM user_data WHERE user_id = $1', [userId], (err, res) => {
        if (err) throw err
        let group = res.rows[0]['exp_group']
        if (group.length > 2) return
        let input = 'both1' + group
        pool.query('UPDATE user_data SET exp_group = $1 WHERE user_id = $2', [input, userId], (err, res) => {
          if (err) throw err
        })
      })
    }
  }
  userSatisfaction (obj, callback) {
    let userId = obj.userId
    let trial = obj.trial
    let prop = Object.keys(obj)
    let items = []

    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      for (let i = 0; i < prop.length; i++) {
        if (prop[i] === 'userId' || prop[i] === 'trial') continue
        let foodId = prop[i].slice(0, prop[i].indexOf('-'))
        let type = prop[i].slice(prop[i].indexOf('-') + 1, prop[i].lastIndexOf('-'))
        let state = prop[i].slice(prop[i].lastIndexOf('-') + 1)
        let index = _.findIndex(items, function (o) { return o.id === foodId })
        if (index === -1) {
          let newRecord = {
            id: foodId,
            state: state,
            [type]: obj[prop[i]]
          }
          items.push(newRecord)
        } else {
          items[index][type] = obj[prop[i]]
          let input = [userId, trial, items[index]['id'], items[index]['state'], items[index]['satisfaction'], items[index]['confidence']]
          client.query('INSERT INTO user_satisfaction (user_id, trial_num, food_id, state, satisfaction, confidence) VALUES ($1, $2, $3, $4, $5, $6)', input, (err, res) => {
            if (checked === false) {
              done()
              checked = true
            }
            if (err) throw err
            callback(res.rows)
          })
        }
      }
    })
  }
  surveyTimeRecord (obj, callback) {
    let start = new Date(Number(obj.startingTime))
    console.log(start, obj.endTime)
    let input = [obj.userId, obj.trial, start, obj.endTime, obj.timeUsed, obj.surveyName]
    pool.query('INSERT INTO survey_time (user_id, trial_num, starting_time, end_time, time_used, survey_name) VALUES ($1, $2, $3, $4, $5, $6)', input, (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}

module.exports = new Survey1()
