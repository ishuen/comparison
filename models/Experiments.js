/* global itemSetList */
const pool = require('../db')
const _ = require('lodash')
class Experiments {
  // addUserDefinedScores (obj, callback) {
  //   pool.query('INSERT INTO sorting_experiment (food_id, new_health, new_taste, user_id, trial_num) VALUES ($1, $2, $3, $4, $5) RETURNING exp_id', [obj.food_id, obj.new_health, obj.new_taste, obj.user_id, obj.trial_num], (err, res) => {
  //     if (err) throw err
  //     callback(res.rows)
  //   })
  // }

  addAllUserDefinedScores (arr, callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      for (let obj of arr) {
        client.query('INSERT INTO sorting_experiment (food_id, new_health, new_taste, user_id, trial_num) VALUES ($1, $2, $3, $4, $5) RETURNING exp_id', [obj.food_id, obj.new_health, obj.new_taste, obj.user_id, obj.trial_num], (err, res) => {
          if (checked === false) {
            done()
            checked = true
          }
          if (err) {
            console.log(err.stack)
          } else {
            callback(res.rows)
          }
        })
      }
    })
  }

  insertQnAns (arr, callback) {
    let qnId = arr.map(x => x[0])
    // select all questions about to answer from survey_questions
    pool.query('SELECT * FROM survey_questions WHERE qn_id = ANY($1::integer[])', [qnId], (err, res) => {
      if (err) throw err
      // check the ans type and divide into 2
      let allQns = res.rows
      // console.log(allQns)
      let likert = arr.filter(function (q) {
        let qn = allQns.find(function (p) {
          return Number(p.qn_id) === Number(q[0])
        })
        return qn.ans_type === '5_scale'
      })
      let comment = arr.filter(function (q) { return !likert.includes(q) })

      pool.connect((err, client, done) => {
        if (err) throw err
        // insert into rating
        for (let rating of likert) {
          client.query('INSERT INTO user_rating (qn_id, user_id, rating, trial, item_order) VALUES ($1, $2, $3, $4, $5) RETURNING rating_id', rating, (err, res) => {
            done()
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res.rows)
            }
          })
        }
        // insert into comment
        for (let co of comment) {
          client.query('INSERT INTO user_comment (qn_id, user_id, description, trial, item_order) VALUES ($1, $2, $3, $4, $5) RETURNING comment_id', co, (err, res) => {
            if (err) throw err
            console.log(res.rows)
          })
        }
      })
      callback(res.rows)
    })
  }

  insertAllQnAns (arr, callback) {
    let qnId = arr.map(x => x[0])
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT * FROM survey_questions WHERE qn_id = ANY($1::integer[])', [qnId], (err, res) => {
        done()
        if (err) throw err
        // check the ans type and divide into 2
        let allQns = res.rows
        // console.log(allQns)
        let likert = arr.filter(function (q) {
          let qn = allQns.find(function (p) {
            return Number(p.qn_id) === Number(q[0])
          })
          return qn.ans_type === '5_scale'
        })
        let comment = arr.filter(function (q) { return !likert.includes(q) })
        // insert into rating
        for (let rating of likert) {
          client.query('INSERT INTO user_rating (qn_id, user_id, rating, trial, item_order, food_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING rating_id', rating, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res.rows)
            }
          })
        }
        // insert into comment
        for (let co of comment) {
          client.query('INSERT INTO user_comment (qn_id, user_id, description, trial, item_order) VALUES ($1, $2, $3, $4, $5) RETURNING comment_id', co, (err, res) => {
            if (err) throw err
            console.log(res.rows)
          })
        }
      })
    })
  }

  insertDemog (user, callback) {
    console.log(user)
    let arr = [user.Age, user.gender, user.Occupation, user['Country of Residence'], user.Ethnicity, user.userId]
    console.log(arr)
    pool.query('UPDATE user_data SET age = $1, gender = $2, occupation = $3, cor = $4, ethnicity = $5 WHERE user_id = $6', arr, (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }

  userSorting (details, callback) {
    let userId = details.userId
    let expData = [Number(userId), Number(details.trial)]
    let done = [0, 0, 0]
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT * FROM sorting_experiment WHERE user_id = $1 AND trial_num = $2', expData, (err, res) => {
        done()
        if (err) throw err
        let exp = res.rows
        for (let i = 0; i < details.ordering.length; i++) {
          let expItem = _.find(exp, function (o) {
            return _.isEqual(o.food_id, details.ordering[i])
          })
          let input = [userId, details.ordering[i], i + 1, expItem['exp_id']]
          client.query('INSERT INTO user_sorting (user_id, food_id, ordering, exp_id) VALUES ($1, $2, $3, $4)', input, (err, res) => {
            if (err) throw err
          })
        }
      })
    })
    done[0] = 1
    let start = new Date(Number(details.startingTime))
    let input = [userId, start, details.endTime, details.timeUsed, details.trial]
    pool.query('INSERT INTO user_sorting_record (user_id, starting_time, end_time, time_used, trial_num) VALUES ($1, $2, $3, $4, $5) RETURNING record_number', input, (err, res) => {
      if (err) throw err
      let recordNum = res.rows[0]['record_number']
      done[1] = 1
      done[2] = storeTracked(userId, recordNum, details.tracking[0])
      callback(done)
    })
  }

  getCustomSet (userId, trial, callback) {
    let input = [userId, itemSetList[trial - 1]]
    pool.query('SELECT * FROM sorting_experiment INNER JOIN hpbdata ON (sorting_experiment.food_id = hpbdata.id) WHERE user_id = $1 AND food_id = ANY($2::varchar[])', input, (err, res) => {
      if (err) throw err
      // console.log(res.rows)
      let data = []
      _.map(res.rows, function (i) {
        i.path = i.image.toString('utf8')
        let temp = {
          id: i.id,
          foodname: i.foodname,
          health: i.new_health,
          taste: i.new_taste,
          path: i.path,
          exp_id: i.exp_id
        }
        data.push(temp)
      })
      callback(data)
    })
  }

  insertUserChoice (details, callback) {
    if (details.tracking.length > 0) {
      storeSliding(details.userId, details.trial, details.defaultIndex, details.tracking)
    }
    let input = [details.userId, details.startingTime, details.endTime, details.timeUsed, details.trial, details.item.foodId]
    pool.query('INSERT INTO user_choice (user_id, starting_time, end_time, time_used, trial_num, food_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING choice_id', input, (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }

  getUserChoice (userId, trial, callback) {
    let input = [userId, trial]
    pool.query('SELECT * FROM user_choice INNER JOIN hpbdata ON (user_choice.food_id = hpbdata.id) WHERE user_id = $1 AND trial_num = $2', input, (err, res) => {
      if (err) throw err
      if (res.rows[0]['image'] != null) {
        res.rows[0]['path'] = res.rows[0]['image'].toString('utf8')
      } else {
        res.rows[0]['path'] = '/images/abs_food.png'
      }
      let obj = {
        id: res.rows[0].food_id,
        foodname: res.rows[0].foodname,
        health: res.rows[0].health,
        taste: res.rows[0].taste,
        path: res.rows[0].path
      }
      callback(obj)
    })
  }
}
module.exports = new Experiments()

function storeTracked (userId, recordNum, trackedData) {
  for (let record of trackedData) {
    const len = record.order.length
    for (let i = 0; i < len; i++) {
      let time = new Date(Number(record.time_stamp))
      let input = [recordNum, record.order[i], userId, time, i]
      pool.query('INSERT INTO user_track (record_number, food_id, user_id, time_stamp, ordering) VALUES ($1, $2, $3, $4, $5)', input, (err, res) => {
        if (err) throw err
      })
    }
  }
  return 1
}
function storeSliding (userId, trial, defaultIndex, trackedData) {
  for (let record of trackedData) {
    let time = new Date(Number(record.time_stamp))
    let input = [record.from, record.to, trial, time, userId, defaultIndex]
    pool.query('INSERT INTO user_choosing_process (slide_from, slide_to, trial_num, time_stamp, user_id, default_index) VALUES ($1, $2, $3, $4, $5, $6)', input, (err, res) => {
      if (err) throw err
    })
  }
}
