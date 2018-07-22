function likertTable (data) {
  console.log(data) // question set
  var headerSet = [, 'Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree']
  var radioSet = headerSet.slice(0)
  radioSet.shift()
  console.log(radioSet)
  var table = d3.select('body').append('form').append('table')
    .attr('border','1')
    .style('border-collapse', 'collapse')
  var tr = table.append('tr')
  tr.selectAll('th')
    .data(headerSet)
    .enter()
    .append('th')
    .text(function (d, i) {return d})
  for (qn of data) {
    console.log('qn', qn)
    let tr = table.append('tr')
      tr.append('td')
      .text(qn.description)
    if (qn.ans_type === '5_scale') {
      for (let i = 0; i < 5; i++) {
        tr.append('td')
        .data(radioSet)
        .insert('input')
        .attr({type: 'radio', value: function(d, i) {return i}})
        .property("checked", false)
      }
    }
    else if (qn.ans_type === 'open_ended') {
      tr.append('td').attr('colspan', 5)
      .append('input').attr('type','text')
      .attr('placeholder', 'Write your answer here.')
    }

  }
}

function validateForm() {
  let form = document.getElementById('form')
  let ans = form.getElementsByTagName('input')
  let names = $('input').map(function(){ return $(this).attr('name') })
  let comment = form.getElementsByTagName('textarea')
  let distinctNames = $.unique(names)
  distinctNames = distinctNames.filter(function(o) { return distinctNames[o] !== 'userId' && distinctNames[o] !== 'others'})
  for (let qn of distinctNames) {
    let radioSet = document.getElementsByName(qn)
    let selected = false
    for (let radio of radioSet) {
      if (radio.checked === true) { selected = true }
    }
    if (selected === false) {
      console.log(qn)
      alert('Please answer all questions.')
      return false
    }
  }
  if (document.getElementsByName('qn14')[5].checked === true && comment[0].value === '') {
    alert('Please describe your dietary restriction.')
    return false
  }
  return true
}

function validateFormSurvey2() {
  let form = document.getElementById('form')
  let ans = form.getElementsByTagName('input')
  let names = $('input').map(function(){ return $(this).attr('name') })
  let distinctNames = $.unique(names)
  distinctNames = distinctNames.filter(function(o) { return (distinctNames[o] !== 'userId' && distinctNames[o] !== 'trial' && distinctNames[o] !== 'itemOrder' && distinctNames[o] !== 'itemId' && distinctNames[o] !== 'taste' && distinctNames[o] !== 'health')})
  for (let qn of distinctNames) {
    let radioSet = document.getElementsByName(qn)
    let selected = false
    for (let radio of radioSet) {
      if (radio.checked === true) { selected = true }
    }
    if (selected === false) {
      console.log(qn)
      alert('Please answer all questions.')
      return false
    }
  }
  return true
}
function validateExpForm() {
  let form = document.getElementById('form')
  let ans = form.getElementsByTagName('input')
  let names = $('input').map(function(){ return $(this).attr('name') })
  let distinctNames = $.unique(names)
  distinctNames = distinctNames.filter(function(o) { return (distinctNames[o] !== 'userId' && distinctNames[o] !== 'trial' && distinctNames[o] !== 'others')})
  for (let qn of distinctNames) {
    if (qn === 'qn29') {
      if (document.getElementsByName(qn)[0].value === '') {
        console.log(qn)
        alert('Please describe how you sort the items.')
        return false
      }
    } else if (qn === 'qn40') {
      if (document.getElementsByName(qn)[0].value === '') {
        console.log(qn)
        alert('Please describe how you found the item.')
        return false
      }
    } else if (qn === 'qn34') {
      // no check
    } else {
      let radioSet = document.getElementsByName(qn)
      let selected = false
      for (let radio of radioSet) {
        if (radio.checked === true) { selected = true }
      }
      if (selected === false) {
        console.log(qn)
        alert('Please answer all questions.')
        return false
      }
      if (qn === 'qn45') {
        if (document.getElementsByName(qn)[3].checked === true && document.getElementsByName('others')[0].value === '') {
          alert('Please describe what you focused on.')
          return false
        }
      }
    } 
  }
  // did not check qn 46
  return true
}