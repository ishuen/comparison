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