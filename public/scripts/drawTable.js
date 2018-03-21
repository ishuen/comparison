function drawTable (csvdata, mid_name, path) {
  // draw table
  var colomn_set = []
  for (var colomn in csvdata[0]) {
    colomn_set.push(colomn)
  }
  var table = d3.select('body').append('table')
    .attr('border','1')
  var tr = table.append('tr')
  tr.selectAll('th')
    .data(colomn_set)
    .enter()
    .append('th')
    .text(function (d, i) { return d })

  var bgcolor = 'red'
  for (var i in path) {
    for (var key in csvdata) {
      if (csvdata[key]['id'] == path[i]) {
        var td_data = []
        for (var j in csvdata[key]) {
          td_data.push(csvdata[key][j])
        }
        if (path[i] == mid_name) {
          bgcolor = 'yellow'
        }
        table.append('tr')
          .attr('bgcolor', bgcolor)
          .selectAll('td')
          .data(td_data)
          .enter()
          .append('td')
          .text(function (d, i) { return d })
        if (path[i] == mid_name) {
          bgcolor = 'green'
        }
        break
      }
    }
  }
}
