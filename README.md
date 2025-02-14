# WebFoxDot

WebFoxDot is a web-based interface for the FoxDot or Renardo live coding music environment. It allows you to write and send code to a local FoxDot or Renardo program running on your computer.

> [!Note]
> WebFoxDoT IS NOT a full web-based version of FoxDot or Renardo. You still need to have FoxDot or Renardo installed on your computer to use WebFoxDot.

## How does it look?

![WebFoxDot](./webFoxdot.png)

## Known issues
- WebFoxDot is not working with Chrome or other Chromium based browser (Vivaldi, Edge, Brave, Opera, ... ), some shortcuts are not recognized
- Not tested yet on Safari or other web browsers

## Requirements
- a fully working FoxDot or Renardo installation
- a modern web browser (for now it works only with Firefox)
- the websocket package for Python (install it with `pip install websockets`)

## Installation with Python

### Clone the repository and go to the directory:
```bash
git clone git@github.com:CrashServer/webFoxDot.git
cd webFoxDot
```

### Rename the config file and edit the foxdot path:
```bash
cp config.py.sample config.py
nano config.py

Change the FOXDOT_PATH to your foxdot path
```

### Copy the content of this startup.py file to your FoxDot startup file:
```text
Your startup file is located in the FoxDot directory:
/FoxDot/lib/Custom/startup.py
```

### Run Foxdot with a server:
```python
python server.py
```

> [!WARNING]
> You don't need to run FoxDot manually, the server will start FoxDot for you. 
> Also, make sure you have something like this 3 lines printed in your terminal, if not restart from the beginning:
> ```python
> FoxDot started, pid: 79311
> WebSocket server started on port 1234
> Start FoxDot WebSocket server at ws://localhost:20000
> ```

### Start a http server to serve the web interface:
```python
cd dist
python -m http.server
```

> [!WARNING] 
> Make sure that your running the server in the `dist` directory because it's a compiled version of the web interface. For running in development mode, see the `Installation with Node.js` section.

### Open your browser and go to `http://localhost:8000`

## Installation with Node.js
if you want to run the web interface in development mode, you need to have Node.js installed on your computer.

### Clone the repository and go to the directory:
```bash
git clone git@github.com:CrashServer/webFoxDot.git
cd webFoxDot
```

### Rename the config file and edit the foxdot path:
```bash
cp config.js.sample config.js
nano config.js

Change the FOXDOT_PATH to your foxdot path
```

### Copy the content of this startup.py file to your FoxDot startup file:
```text
Your startup file is located in the FoxDot directory:
/FoxDot/lib/Custom/startup.py
```

### Run the FoxDot server:
```python
python server.py
```

> [!WARNING]
> You don't need to run FoxDot manually, the server will start FoxDot for you. 
> Also, make sure you have something like this 3 lines printed in your terminal, if not restart from the beginning:
> ```python
> FoxDot started, pid: 79311
> WebSocket server started on port 1234
> Start FoxDot WebSocket server at ws://localhost:20000
> ```

### Start a http server to serve the web interface:
```js
npm install
npm run dev
```

### Open your browser and go to `http://localhost:3000`
