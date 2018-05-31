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