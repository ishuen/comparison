function drawTable (csvdata, mid_name, path) {
  csvdata = removeMeasurementProperties(csvdata)
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

function drawTableObjectArr(data, mid) {
  data = removeMeasurementProperties(data)
  var table = d3.select('body').append('table')
    .attr('border','1')
  let attr = Object.keys(data[0])
  attr.push('Rank')
  var tr = table.append('tr')
  tr.selectAll('th')
    .data(attr)
    .enter()
    .append('th')
    .text(function (d, i) { return d })
  var bgcolor = 'red'
  let count = 0
  for (let index in data) {
    let row = Object.values(data[index])
    if (data[index].id == mid.id) {
      bgcolor = 'yellow'
    } else if(data[index]['RRR\''] >= mid['RRR\'']) {
      bgcolor = 'red'
    } else {
      bgcolor = 'green'
    }
    row.push(Number(index) + 1)
    table.append('tr')
      .attr('bgcolor', bgcolor)
      .selectAll('td')
      .data(row)
      .enter()
      .append('td')
      .text(function (d, i) { return d })
  }
}

function removeMeasurementProperties (data) {
  for (item of data) {
    delete item['RRR']
    delete item['TOri']
    delete item['T\'']
    delete item['rank']
  }
  return data
}
