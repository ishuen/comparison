function  drawBoxPlot (data) {
  let tasteData = []
  let healthData = []
  for (let item of data) {
    tasteData.push(item.new_taste)
    healthData.push(item.new_health)
  }
  let trace1 = {
    y: tasteData,
    type: 'box',
    name: 'Taste Scores',
    marker: {
     color: 'red',
    }
  }
  let trace2 = {
    y: healthData,
    type: 'box',
    name: 'Health Scores',
    marker: {
     color: 'green',
    }
  }
  let scores = [trace1, trace2]
  let layout = {
    autosize: false,
    width: 400,
    height: 350,
    margin: {
      l: 30,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: true,
    legend: {"orientation": "h"}
   }
  Plotly.newPlot('boxplotDiv', scores, layout)
}

function drawHistogram (data) {
  let tasteData = []
  let healthData = []
  for (let item of data) {
    tasteData.push(item.new_taste)
    healthData.push(item.new_health)
  }
  let trace1 = {
    x: tasteData,
    type: 'histogram',
    name: 'Taste Scores',
    opacity: 0.5,
    marker: {
     color: 'red',
    },
  }
  let trace2 = {
    x: healthData,
    type: 'histogram',
    name: 'Health Scores',
    opacity: 0.5,
    marker: {
     color: 'green',
    }
  }
  let scores = [trace1, trace2]
  let layout = {
    barmode: 'overlay',
    width: 400,
    height: 350,
    autosize: false,
    margin: {
      l: 30,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: true,
    legend: {"orientation": "h"}
  }
  Plotly.newPlot('histogramDiv', scores, layout)
}
function drawLineChart (data, destination) {
  console.log(data)
  let trace1 = {
    mode: 'lines+markers',
    type: 'scatter',
    name: 'user sorting',
    x: data.userResult.map(function (x) {return x.new_taste}),
    y: data.userResult.map(function (x) {return x.new_health}),
    line:{opacity:0.5}
  }
  let trace2 = {
    mode: 'lines+markers',
    type: 'scatter',
    name: 'pareto',
    x: data.pareto.data.map(function (x) {return x.new_taste}),
    y: data.pareto.data.map(function (x) {return x.new_health}),
    line:{opacity:0.5}
  }
  let trace3 = {
    mode: 'lines+markers',
    type: 'scatter',
    name: 'heuristic',
    x: data.heuristic.data.map(function (x) {return x.new_taste}),
    y: data.heuristic.data.map(function (x) {return x.new_health}),
    line:{opacity:0.5}
  }
  let trace4 = {
    mode: 'lines+markers',
    type: 'scatter',
    name: 'genetic',
    x: data.genetic.data.map(function (x) {return x.new_taste}),
    y: data.genetic.data.map(function (x) {return x.new_health}),
    line:{opacity:0.5}
  }
  let traces = [trace1, trace2, trace3, trace4]
  let layout = {
    // barmode: 'overlay',
    width: 400,
    height: 250,
    autosize: false,
    margin: {
      l: 30,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: true,
    // legend: {"orientation": "h"}
  }
  Plotly.newPlot(destination, traces, layout)
}
function drawForUser (data, destination) {
  let trace1 = { // user
    mode: 'lines+markers',
    type: 'scatter',
    name: 'taste',
    x: data.userResult.map(function (x) {return x.ordering}),
    y: data.userResult.map(function (x) {return x.new_taste}),
    line:{ opacity:0.5},
    marker: {
     color: 'red',
    }
  }
  let trace2 = { // user
    mode: 'lines+markers',
    type: 'scatter',
    name: 'health',
    x: data.userResult.map(function (x) {return x.ordering}),
    y: data.userResult.map(function (x) {return x.new_health}),
    yaxis: 'y2',
    line:{opacity:0.5},
    marker: {
     color: 'green',
    }
  }
  let layout = {
    title: 'User sorting',
    xaxis: {
      autotick: false,
      tick0: 1,
      dtick: 1,
    },
    yaxis: {
      title: 'taste',
      titlefont: {color: 'red'},
      tickfont: {color: 'red'},
    },
    yaxis2: {
      title: 'health',
      titlefont: {color: 'green'},
      tickfont: {color: 'green'},
      overlaying: 'y',
      side: 'right'
    },
    width: 350,
    height: 200,
    autosize: false,
    margin: {
      l: 50,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: false,
    // legend: {"orientation": "h"}
  }
  let traces = [trace1, trace2]
  Plotly.newPlot(destination + 'user', traces, layout)
}
function drawPareto (data, destination) {
  let len = data.pareto.data.length
  let arr =  Array.from({length: len}, (v, k) => k + 1)
  let trace1 = { // pareto
    mode: 'lines+markers',
    type: 'scatter',
    name: 'taste',
    x: arr,
    y: data.pareto.data.map(function (x) {return x.new_taste}),
    line:{ opacity:0.5},
    marker: {
     color: 'red',
    }
  }
  let trace2 = { // pareto
    mode: 'lines+markers',
    type: 'scatter',
    name: 'health',
    x: arr,
    y: data.pareto.data.map(function (x) {return x.new_health}),
    yaxis: 'y2',
    line:{opacity:0.5},
    marker: {
     color: 'green',
    }
  }
  let layout = {
    title: 'Pareto',
    xaxis: {
      autotick: false,
      tick0: 1,
      dtick: 1,
    },
    yaxis: {
      title: 'taste',
      titlefont: {color: 'red'},
      tickfont: {color: 'red'},
    },
    yaxis2: {
      title: 'health',
      titlefont: {color: 'green'},
      tickfont: {color: 'green'},
      overlaying: 'y',
      side: 'right'
    },
    width: 350,
    height: 200,
    autosize: false,
    margin: {
      l: 50,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: true,
    legend: {
      // "orientation": "h",
      x: 1.1,
      // y: -0.2
    },
  }
  let traces = [trace1, trace2]
  Plotly.newPlot(destination + 'pareto', traces, layout)

}
function drawHeuristic (data, destination) {
  let len = data.heuristic.data.length
  let arr =  Array.from({length: len}, (v, k) => k + 1)
  let trace1 = { // heuristic
    mode: 'lines+markers',
    type: 'scatter',
    name: 'taste',
    x: arr,
    y: data.heuristic.data.map(function (x) {return x.new_taste}),
    line:{ opacity:0.5},
    marker: {
     color: 'red',
    }
  }
  let trace2 = { // heuristic
    mode: 'lines+markers',
    type: 'scatter',
    name: 'health',
    x: arr,
    y: data.heuristic.data.map(function (x) {return x.new_health}),
    yaxis: 'y2',
    line:{opacity:0.5},
    marker: {
     color: 'green',
    }
  }
  let layout = {
    title: 'Heuristic',
    xaxis: {
      autotick: false,
      tick0: 1,
      dtick: 1,
    },
    yaxis: {
      title: 'taste',
      titlefont: {color: 'red'},
      tickfont: {color: 'red'},
    },
    yaxis2: {
      title: 'health',
      titlefont: {color: 'green'},
      tickfont: {color: 'green'},
      overlaying: 'y',
      side: 'right'
    },
    width: 350,
    height: 200,
    autosize: false,
    margin: {
      l: 50,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: false,
    // legend: {
    //   "orientation": "h",
    //   x: 0,
    //   y: -0.2
    // },
  }
  let traces = [trace1, trace2]
  Plotly.newPlot(destination + 'heuristic', traces, layout)
}
function drawGenetic (data, destination) {
    let len = data.genetic.data.length
  let arr =  Array.from({length: len}, (v, k) => k + 1)
  let trace1 = { // genetic
    mode: 'lines+markers',
    type: 'scatter',
    name: 'taste',
    x: arr,
    y: data.genetic.data.map(function (x) {return x.new_taste}),
    line:{ opacity:0.5},
    marker: {
     color: 'red',
    }
  }
  let trace2 = { // genetic
    mode: 'lines+markers',
    type: 'scatter',
    name: 'health',
    x: arr,
    y: data.genetic.data.map(function (x) {return x.new_health}),
    yaxis: 'y2',
    line:{opacity:0.5},
    marker: {
     color: 'green',
    }
  }
  let layout = {
    title: 'Genetic',
    xaxis: {
      autotick: false,
      tick0: 1,
      dtick: 1,
    },
    yaxis: {
      title: 'taste',
      titlefont: {color: 'red'},
      tickfont: {color: 'red'},
    },
    yaxis2: {
      title: 'health',
      titlefont: {color: 'green'},
      tickfont: {color: 'green'},
      overlaying: 'y',
      side: 'right'
    },
    width: 350,
    height: 200,
    autosize: false,
    margin: {
      l: 50,
      r: 30,
      b: 30,
      t: 30,
      pad: 4
    },
    showlegend: false,
    // legend: {
    //   "orientation": "h",
    //   x: 0,
    //   y: -0.2
    // },
  }
  let traces = [trace1, trace2]
  Plotly.newPlot(destination + 'genetic', traces, layout)
}
function drawDualYChart (data, destination) {
  drawForUser(data, destination)
  drawPareto(data, destination)
  drawHeuristic(data, destination)
  drawGenetic(data, destination)
}

function drawPieChart (data, title, destination) {
  var trace = [{
  values: data,
  labels: ['OK', 'Allergic', 'Intolerant', 'Choose not to eat', 'Dislike'],
  type: 'pie'
  }]
  if (title.includes('(')) {
    let index = title.indexOf('(')
    title = title.slice(0, index-1)
  }
  if (title === 'Others') {
    var layout = {
      autosize: false,
      title: title,
      height: 250,
      width: 400,
      showlegend: true,
      margin: {
        l: 10,
        r: 10,
        b: 30,
        t: 50,
        pad: 4
      },
    }
  } else {
    var layout = {
      autosize: false,
      title: title,
      height: 250,
      width: 250,
      showlegend: false,
      margin: {
        l: 10,
        r: 10,
        b: 30,
        t: 50,
        pad: 4
      },
    }
  }
  

  Plotly.newPlot(destination, trace, layout)
}

function drawPieChartVeg (data, destination) {
  var trace = [{
    values: data,
    labels: ['Vegan', 'Ovo-vegetarian', 'Lacto-vegetarian', 'Lacto-ovo vegetarian', 'Pescatarian', 'neither'],
    type: 'pie'
  }]
  var layout = {
    autosize: false,
    title: 'vegan/ vegetarian',
    height: 250,
    width: 400,
    showlegend: true,
    margin: {
      l: 10,
      r: 10,
      b: 30,
      t: 50,
      pad: 4
    },
  }
  Plotly.newPlot(destination, trace, layout)
}

function drawAgreementPie (data, title, destination) {
  var trace = [{
    values: data,
    labels: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
    type: 'pie'
  }]
  var layout = {
    autosize: false,
    title: title,
    height: 450,
    width: 400,
    showlegend: true,
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 40,
      pad: 2
    },
    legend: {
      "orientation": "h",
      x: 1,
      y: -0.1
    }
  }
  Plotly.newPlot(destination, trace, layout)
}
function drawSmallAgreementPie (data, title, destination, legend) {
  var trace = [{
    values: data,
    labels: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
    type: 'pie'
  }]
  let index = title.indexOf(',')
  if (index != -1) {
    let str = title.slice(0, index + 2) + '<br>' + title.slice(index + 2)
    title = str
  }
  let width = 300
  if (legend == true) width = 500
  var layout = {
    autosize: false,
    title: title,
    height: 260,
    width: width,
    showlegend: legend,
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 40,
      pad: 2
    },
    legend: {
      // orientation: 'h',
      x: 1,
      y: 0.5
    },
    titlefont: {
      size: 12
    },
  }
  Plotly.newPlot(destination, trace, layout)
}