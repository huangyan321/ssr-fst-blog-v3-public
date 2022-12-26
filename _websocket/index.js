/** @format */
// server 1
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

wss = new WebSocketServer({ port: 9002 });
wss.on('connection', function (ws) {
  console.log('client connected');
  ws.on('message', function (message, isBinary) {
    const bf = new Buffer(message);
    const bfStr = bf.toString('utf8');
    if (!bfStr) return;
    console.log(bfStr);
    bfStrToObj = JSON.parse(bfStr);
    if (bfStrToObj.type === 'heartbeat')
      return ws.send(
        JSON.stringify({
          type: 'heartbeat',
          data: null,
          msg: 'ok'
        })
      );
    if (bfStrToObj.type === 'webpack') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(bfStr, { binary: isBinary });
        }
      });
    }
  });
});
