function drawDualYGraph (data, defaultPoint) {
  var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom

  // var parseDate = d3.time.format("%d-%b-%y").parse

  var x = d3.scale.linear().range([0, width])
  var y0 = d3.scale.linear().range([height, 0])
  var y1 = d3.scale.linear().range([height, 0])

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5)

  var yAxisLeft = d3.svg.axis().scale(y0)
    .orient("left").ticks(5)

  var yAxisRight = d3.svg.axis().scale(y1)
    .orient("right").ticks(5) 

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.rank) })
    .y(function(d) { return y0(d['RRR\'']) })
    
  var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.rank) })
    .y(function(d) { return y1(d['T\'c']) })
  
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  for (let i in data) {
    data[i]['rank'] = Number(i)+1
  }

  // Scale the range of the data
  x.domain([1, data.length]) 
  y0.domain([0, d3.max(data, function(d) { return Math.max(d['RRR\'']) })]) 
  y1.domain([0, d3.max(data, function(d) { return Math.max(d['T\'c']) })])

  svg.append("path")        // Add the valueline path.
    .attr("d", valueline(data))
    .style("stroke", "steelblue")
    .style("fill", "none")

  svg.append("path")        // Add the valueline2 path.
    .style("stroke", "red")
    .style("fill", "none")
    .attr("d", valueline2(data))

  svg.append("g")            // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  svg.append("g")
    .attr("class", "y axis")
    .style("fill", "steelblue")
    .call(yAxisLeft) 

  svg.append("g")       
    .attr("class", "y axis")  
    .attr("transform", "translate(" + width + " ,0)") 
    .style("fill", "red")   
    .call(yAxisRight)

  svg.append("text")      // text label for the x axis
    .attr("x", 265 )
    .attr("y", 240 )
    .style("text-anchor", "middle")
    .text("Rank")

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Health")
}