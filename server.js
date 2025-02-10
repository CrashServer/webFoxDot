import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { config } from './config'

const FOXDOT_PATH = '/path/to/FoxDot';

// Start FoxDot
const foxdot = spawn('python', ['-m', 'FoxDot', '-p'], {
  cwd: config.FOXDOT_PATH,
  env: {...process.env, PYTHONUNBUFFERED: '1'}
});
  
console.log(`FoxDot started, pid: ${foxdot.pid} `);
  
// WebSocket backend Server
const wss = new WebSocketServer({ port: 1234 });

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  //Foxdot Message
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'evaluate_code') {
        const {code} = data;
        broadcastLog(`>> ${code}`);
        foxdot.stdin.write(data.code + '\n' + '\n');
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Logs FoxDot
foxdot.stdout.on('data', (data) => {
  try {
    const logMessage = data.toString();
    console.log(logMessage);
    broadcastLog(logMessage);
  } catch (e) {
    console.error('error sending log message:', e);
  }
});

// Logs Foxdot console
function broadcastLog(message, color=null) {
  const messageObj = {
    type: 'foxdot_log',
    data: message,
    color: color
  };

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(messageObj));
    }
  });
}

console.log('Server started port 1234');