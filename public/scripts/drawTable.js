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
    .style('border-collapse', 'collapse')
  let attr = Object.keys(data[0])
  attr.push('Rank')
  var tr = table.append('tr')
  tr.selectAll('th')
    .data(attr)
    .enter()
    .append('th')
    .attr('bgcolor', '#dddddd')
    .text(function (d, i) { return d })
  var bgcolor = ''
  let count = 0
  for (let index in data) {
    let row = Object.values(data[index])
    const midIn = data.findIndex(ele => ele.id === mid.id)
    if (index == midIn) {
      bgcolor = '#FAFDAB' //yellow
    } else if(index > midIn) {
      bgcolor = '#A1E3B7' //green
    } else {
      bgcolor = '#FEB0B0' //red
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
    delete item['FoodSubGroup']
    delete item['PerServingHouseholdMeasure']
    for (let k of Object.keys(item)){
      let re = /%/
      if (k.match(re)) { delete item[k] }
    }
  }
  return data
}