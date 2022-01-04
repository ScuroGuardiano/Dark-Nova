const httpProxy = require('http-proxy');
const express = require('express');
const config = require('./proxy.conf');
const { inspect } = require('util');

const proxy = httpProxy.createProxyServer({
  ws: true
});

proxy.on('error', err => {
  console.error(`[PROXY] Ah shiet... ${inspect(err)}`);
});

const app = express();

app.get(['/api', '/api/**'], (req, res) => {
  proxy.web(req, res, { target: config.API });
});

app.get(['/admin', '/admin/**'], (req, res) => {
  req.url = req.url.replace('/admin', '');
  proxy.web(req, res, { target: config.ADMIN });
});

// Angular WS, luckily there's only 1 angular project, it could get tricky with more ;3
app.get(['/sockjs-node', '/sockjs-node/**'], (req, res) => {
  proxy.web(req, res, { target: config.ADMIN });
});

app.get('**', (req, res) => {
  proxy.web(req, res, { target: config.FRONT });
});

const server = app.listen(1337, () => {
  console.log("============================================================");
  console.log("======== Dark Nova Proxy is listening on port 1337  ========");
  console.log("========      Backend can be accessed on /api       ========");
  console.log("========          Admin panel on /admin             ========");
  console.log("========   Every other path is proxied to frontend  ========");
  console.log("========    Do NOT use this proxy on production!    ========");
  console.log("============================================================");
});

server.on('upgrade', function (req, socket, head) {
  if (req.url.includes('_next')) {
    proxy.ws(req, socket, head, { target: config.FRONT_WS });
  }
  if (req.url.includes('/sockjs-node')) {
    proxy.ws(req, socket, head, { target: config.ADMIN_WS });
  }
});
