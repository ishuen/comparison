function drawDualYGraph (data, defaultPoint) {
  var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 560 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom

  var x = d3.scale.linear().range([0, width])
  var y0 = d3.scale.linear().range([height, 0])
  var y1 = d3.scale.linear().range([height, 0])

  var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(5)

  var yAxisLeft = d3.svg.axis().scale(y0)
    .orient('left').ticks(5)

  var yAxisRight = d3.svg.axis().scale(y1)
    .orient('right').ticks(5) 

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.rank) })
    .y(function(d) { return y0(d['RRR\'']) })
    
  var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.rank) })
    .y(function(d) { return y1(d['T\'c']) })
  
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  for (let i in data) {
    data[i]['rank'] = Number(i)+1
  }

  // Scale the range of the data
  x.domain([1, data.length]) 
  y0.domain([0, d3.max(data, function(d) { return Math.max(d['RRR\'']) })]) 
  y1.domain([0, d3.max(data, function(d) { return Math.max(d['T\'c']) })])

  svg.append('path')        // Add the valueline path.
    .attr('d', valueline(data))
    .style('stroke', 'green')
    .style('fill', 'none')

  svg.append('path')        // Add the valueline2 path.
    .style('stroke', 'red')
    .style('fill', 'none')
    .attr('d', valueline2(data))

  svg.append('g')            // Add the X Axis
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.append('g')
    .attr('class', 'y axis')
    .style('fill', 'green')
    .call(yAxisLeft) 

  svg.append('g')       
    .attr('class', 'y axis')  
    .attr('transform', 'translate(' + width + ' ,0)') 
    .style('fill', 'red')   
    .call(yAxisRight)

  svg.append('text')      // text label for the x axis
    .attr('x', width / 2 )
    .attr('y', height + margin.bottom )
    .style('text-anchor', 'middle')
    .text('Rank')

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Health')
}

function drawItemPath (data, defaultPoint) {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 540 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom
  var x = d3.scale.linear().range([0, width])
  var y = d3.scale.linear().range([height, 0])
  var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(5)
  var yAxisLeft = d3.svg.axis().scale(y)
    .orient('left').ticks(5)
  var valueline = d3.svg.line()
    .x(function(d) { return x(d['RRR\'']) })
    .y(function(d) { return y(d['T\'c']) })
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  x.domain([0, d3.max(data, function(d) { return Math.max(d['RRR\'']) })]) 
  y.domain([0, d3.max(data, function(d) { return Math.max(d['T\'c']) })])
  svg.append('path')        // Add the valueline path.
    .attr('d', valueline(data.filter(function (d) {
      return d['RRR\''] <= defaultPoint['RRR\'']
    })))
    .style('stroke', 'red')
    .style('fill', 'none')
  svg.append('path')        // Add the valueline path.
    .attr('d', valueline(data.filter(function (d) {
      return d['RRR\''] >= defaultPoint['RRR\'']
    })))
    .style('stroke', 'green')
    .style('fill', 'none')

  svg.selectAll('.circle')
    .data(data)
    .enter().append('circle')
    .attr('class', 'circle')
    .attr('fill', 'black')
    .attr('r', 2)
    .attr('cx', function(d) { return x(d['RRR\'']) })
    .attr('cy', function(d) { return y(d['T\'c']) })
    .on('mouseover', function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 5)
        .attr('fill', 'steelblue')
      svg.append('text')
            .attr('id', 'itemId')
            .attr('x', x(d['RRR\'']))
            .attr('y', y(d['T\'c']))
            .attr('fill', 'black')
            .text('item:' + d['id'])
    })
    .on('mouseout', function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 2)
        .attr('fill', 'black')
      svg.select('#itemId').remove()
    })

  svg.append('g')            // Add the X Axis
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxisLeft)

  svg.append('text')      // text label for the x axis
    .attr('x', width / 2 )
    .attr('y', height + margin.bottom)
    .style('text-anchor', 'middle')
    .text('Health')

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Taste')

}
function drawDualYGraph1 (data, location, width, height) {
  var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom
  var x = d3.scale.linear().range([0, width])
  var y0 = d3.scale.linear().range([height, 0])
  var y1 = d3.scale.linear().range([height, 0])
  var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(data.length)
  var yAxisLeft = d3.svg.axis().scale(y0)
    .orient('left').ticks(5)
  var yAxisRight = d3.svg.axis().scale(y1)
    .orient('right').ticks(5) 
  var valueline = d3.svg.line()
    .x(function(d) { return x(d.order) })
    .y(function(d) { return y0(d['health']) })
  var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.order) })
    .y(function(d) { return y1(d['taste']) })
  var svg = d3.select(location)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  // Scale the range of the data
  x.domain([1, data.length]) 
  y0.domain([0, d3.max(data, function(d) { return Math.max(d['health']) })]) 
  y1.domain([0, d3.max(data, function(d) { return Math.max(d['taste']) })])
  svg.append('path')        // Add the valueline path.
    .attr('d', valueline(data))
    .attr('class', 'healthLine')
    .style('stroke', 'green')
  svg.append('path')        // Add the valueline2 path.
    .style('stroke', 'red')
    .attr('d', valueline2(data))
    .attr('class', 'tasteLine')
  svg.append('g')            // Add the X Axis
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y0 axis')
    .style('fill', 'green')
    .call(yAxisLeft) 
  svg.append('g')       
    .attr('class', 'y1 axis')  
    .attr('transform', 'translate(' + width + ' ,0)') 
    .style('fill', 'red')
    .call(yAxisRight)
  svg.append('text')      // text label for the x axis
    .attr('x', width / 2 )
    .attr('y', height + margin.bottom )
    .style('text-anchor', 'middle')
    .text('Item Order')
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Health')
}
function updateData(data, location, width, height) {
  var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom
  var x = d3.scale.linear().range([0, width])
  var y0 = d3.scale.linear().range([height, 0])
  var y1 = d3.scale.linear().range([height, 0])
  var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(data.length)
    .tickFormat(d3.format("d"))
  var yAxisLeft = d3.svg.axis().scale(y0)
    .orient('left').ticks(5)
  var yAxisRight = d3.svg.axis().scale(y1)
    .orient('right').ticks(5)
  var valueline = d3.svg.line()
    .x(function(d) { return x(d.order) })
    .y(function(d) { return y0(d['health']) })
  var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.order) })
    .y(function(d) { return y1(d['taste']) })
  x.domain([1, data.length])
  y0.domain([0, d3.max(data, function(d) { return Math.max(d['health']) })]) 
  y1.domain([0, d3.max(data, function(d) { return Math.max(d['taste']) })])
  var svg = d3.select(location).transition()

  // Make the changes
  svg.select(".healthLine")
  .duration(750)
  .attr("d", valueline(data))
  svg.select(".tasteLine")
  .duration(750)
  .attr("d", valueline2(data))
  svg.select(".x.axis").duration(750).call(xAxis)
  svg.select(".y0.axis").duration(750).call(yAxisLeft)
  svg.select(".y1.axis").duration(750).call(yAxisRight)
}