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
    pool.query('SELECT * FROM survey_questions WHERE qn_set = any($1)', [setNum], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getNewId (callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('INSERT INTO user_data (age) VALUES ($1) RETURNING user_id', [0], (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          let group = res.rows[0]['user_id'] % 7
          client.query('UPDATE user_data SET exp_group = $1 where user_id = $2', [group, res.rows[0]['user_id']], (err, res) => {
            if (err) throw err
          })
          callback(res.rows[0]['user_id'])
        }
      })
    })
  }
  getUserGroup (userId, callback) {
    pool.query('SELECT * FROM user_data WHERE user_id = $1', [userId], (err, res) => {
      if (err) throw err
      callback(res.rows[0]['exp_group'])
    })
  }
  // discard
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
  addCandidates (obj, userId, trial, callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      let input = [userId, trial, obj.defaultPoint.id, 'defaultPoint']
      client.query('INSERT INTO user_satisfaction (user_id, trial_num, food_id, state) VALUES ($1, $2, $3, $4)', input, (err, res) => {
        if (checked === false) {
          done()
          checked = true
        }
        if (err) throw err
      })
      let input2 = [userId, trial, obj.data[0].id, 'tastiest/first']
      client.query('INSERT INTO user_satisfaction (user_id, trial_num, food_id, state) VALUES ($1, $2, $3, $4)', input2, (err, res) => {
        if (err) throw err
      })
      let length = obj.data.length
      let input3 = [userId, trial, obj.data[length - 1].id, 'healthiest/last']
      client.query('INSERT INTO user_satisfaction (user_id, trial_num, food_id, state) VALUES ($1, $2, $3, $4)', input3, (err, res) => {
        if (err) throw err
        callback(res.rows)
      })
    })
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
  recordSurveyCode (userId, code, callback) {
    pool.query('UPDATE user_data SET code = $1 WHERE user_id = $2', [code, userId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  checkIdentity (userId, code, callback) {
    pool.query('SELECT * FROM user_data WHERE user_id = $1 AND code = $2', [userId, code], (err, res) => {
      if (err) throw err
      let result = false
      if (res.rows.length > 0) result = true
      callback(result)
    })
  }
}

module.exports = new Survey1()
