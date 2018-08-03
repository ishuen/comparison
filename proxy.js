var redbird = require('redbird')

// require() any handler objects here
// var example = require('./app')

var reverseProxy = redbird(
  {
    port: 9000
  })

reverseProxy.register('http://multisortlist.comp.nus.edu.sg', 'http://multisortlist-i.comp.nus.edu.sg:9080', {useTargetHostHeader: true})

// Attach handlers to the proxy
// reverseProxy.proxy.on('proxyReq', example.onRequest());
// reverseProxy.proxy.on('proxyRes', example.onResponse());
// reverseProxy.proxy.on('proxyReq', example.get());
// reverseProxy.proxy.on('proxyRes', example.get());

// Optionally, add a handler for errors:
reverseProxy.proxy.on('error', function (err, req, res) {
  if (err) throw err
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })

  res.end('Something went wrong. And we are reporting a custom error message.')
})
