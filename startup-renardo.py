import asyncio
import json
import threading
import websockets
from time import *
import os
import re

# Alias for loops
loops = Samples.loops

# Fix the missing FxList
try:
	FxList = effect_manager
except:
	pass


class WebFoxDotPanelWs():
	def __init__(self, ip="localhost", port=20000):
		self.isRunning = False
		self.ip = ip
		self.port = port

		# OSC Server
		self.oscServer = ThreadingOSCServer((self.ip, 2887))
		self.oscServer.addDefaultHandlers()
		self.oscServer.addMsgHandler(
			"/CPU", self.receiveCpu)
		self.oscThread = threading.Thread(target=self.oscServer.serve_forever, daemon=True)
		self.oscThread.start()
		# websocket server
		self.wsClients = set()
		self.websocket_started_event = threading.Event()
		self.websocket_thread = threading.Thread(target=self.start_websocket_server, daemon=True)
		self.websocket_thread.start()
		self.websocket_started_event.wait()
		# bpm send
		self.sendBpm_thread = threading.Thread(target=self.send_bpm_periodically, daemon=True)
		self.sendBpm_thread.start()

		self.bpmTime = 0.2  # time cycle send Scale,Root
		self.beatTime = 0.1  # time cycle send beat
		self.plyTime = 1.0  # time cycle send player
		self.chronoTime = 1.0  # time cycle send chrono

		self.playerCounter = {}
		self.timeInit = time()

		self.threadScale = threading.Thread(target=self.sendScale, daemon=True)
		self.threadRoot = threading.Thread(target=self.sendRoot, daemon=True)
		self.threadBeat = threading.Thread(target=self.sendBeat, daemon=True)
		self.threadPlayer = threading.Thread(target=self.sendPlayer, daemon=True)
		self.threadChrono = threading.Thread(target=self.sendChrono, daemon=True)

		self.start()

	def receiveCpu(self, address, tags, contents, source):
		''' receive CPU usage from SC by OSC and send it to websocket '''
		cpu = round(float(contents[0]), 2)
		if cpu:
			asyncio.run(self.sendWebsocket(
				json.dumps({"type": "cpu", "cpu": cpu})))

	async def sendWsServer(self, websocket):
		self.wsClients.add(websocket)
		try:
			async for message in websocket:
				await asyncio.gather(*[client.send(message) for client in self.wsClients])
				data = json.loads(message)
				if data["type"] == "get_autocomplete":
					await self.sendFoxdotAutocomplete()
		except websockets.ConnectionClosed:
			pass
		finally:
			self.wsClients.remove(websocket)

	async def mainWebsocket(self):
		''' The websocket server '''
		async with websockets.serve(self.sendWsServer, self.ip, self.port):
			self.websocket_started_event.set()
			await asyncio.get_running_loop().create_future()  # run forever

	def start_websocket_server(self):
		''' For using threading '''
		print(f"Start FoxDot WebSocket server at ws://{self.ip}:{self.port}")
		asyncio.run(self.mainWebsocket())

	async def sendWebsocket(self, msg=""):
		''' Send websocket msg to websocket server '''
		try:
			# send message as json format
			uri = f"ws://{self.ip}:{self.port}"
			async with websockets.connect(uri) as websocket:
				await websocket.send(msg)
		except Exception as e:
			print(f"Error sending websocket message: {e}")

	def send_bpm_periodically(self):
		''' Send bpm to websocket server every second '''
		while True:
			bpm = int(Clock.get_bpm())
			asyncio.run(self.sendWebsocket(json.dumps({"type": "bpm", "bpm": bpm})))
			sleep(60/bpm)

	async def sendFoxdotAutocomplete(self):
		''' Send FoxDot autocomplete data to websocket server '''
		fxList = await self.sendFxDict()
		synthList = await self.sendSynthList()
		combined_message = json.dumps({"type": "autocomplete", "autocomplete": {"loopList": loops, "fxList": fxList, "synthList": synthList}})
		await self.sendWebsocket(combined_message)

	async def sendFxDict(self):
		''' Send fx list to websocket server '''
		fx_json_list = []
		for fx_name in FxList.keys():
			fxDefault = FxList[fx_name].defaults
			filtered_fx = {k: v for k,v in fxDefault.items() if not (k.endswith('_') or k.endswith('_d') or k == 'sus')}
			fx_text = ', '.join([f"{k}={v}" for k, v in filtered_fx.items()])
			fx_json_list.append({'text': fx_text, 'displayText': fx_name + '_'})
		fxDict = json.dumps({"type": "fxList", "fx": fx_json_list})
		return fx_json_list

	async def sendSynthList(self):
		args_to_remove = ['amp', 'sus', 'gate', 'pan', 'freq', 'mul', 'bus', 'atk', 'decay', 'rel', 'level', 'peak', 'blur', 'beat_dur', 'buf', "vib", "fmod"]
		synthList = []
		pathSynth = SYNTHDEF_DIR
		synth_list = sorted([f for f in SynthDefs])
		for syn in synth_list:
			if syn != "":
				path = os.path.join(pathSynth, syn + ".scd")
				with open(str(path), "r") as synth:
					synth = synth.readlines()
				synth_txt = [line.strip() for line in synth if line != "\n"]
				txt = str(''.join(synth_txt))
				synthname = re.findall(r"SynthDef(?:\.new)?\(\\(\w+)", txt)
				synthargs = re.findall(r"{\|(.{3,})\|(?:var)", txt)
				if (len(synthname) != 0 and len(synthargs) != 0):
					filtered_args = ', '.join([arg.strip() for arg in synthargs[0].split(', ') if arg.split('=')[0].strip() not in args_to_remove])
					synthList.append({'text': filtered_args, 'displayText': synthname[0]})
		return synthList

	def sendScale(self):
		''' send Scale to OSC server '''
		try:
			while self.isRunning:
				msg = json.dumps({"type": "scale", "scale": str(Scale.default.name)})
				asyncio.run(self.sendWebsocket(msg))
				sleep(self.bpmTime*10)
		except:
			pass

	def sendRoot(self):
		''' send Root to OSC server '''
		try:
			while self.isRunning:
				msg = json.dumps({"type": "root", "root": str(Root.default)})
				asyncio.run(self.sendWebsocket(msg))
				sleep(self.bpmTime*10)
		except:
			pass

	def sendBeat(self):
		''' send Clock.beat to OSC server '''
		try:
			while self.isRunning:
				msg = json.dumps({"type": "beat", "beat": Clock.beat})
				asyncio.run(self.sendWebsocket(msg))
				sleep(self.beatTime)
		except:
			pass

	def sendPlayer(self):
		''' send active player to OSC server '''
		try:
			while self.isRunning:
				self.addPlayerTurn()
				playerListCount = []
				soloPlayers = [p.name for p in Clock.solo.data]
				for k,v in self.playerCounter.items():
					duration = f'{divmod(v, 60)[0]:02d}:{divmod(v, 60)[1]:02d}'
					player = k.name
					if (k.synthdef in ["loop", "stretch"]):
						name = k.filename
					else:
						name = k.synthdef
					playerListCount.append(json.dumps({"player": player, "name": name, "duration": duration, "solo": player in soloPlayers}))
				msg = json.dumps({"type": "players", "players": playerListCount})
				asyncio.run(self.sendWebsocket(msg))
				sleep(self.plyTime)
		except:
			pass

	def sendChrono(self):
		''' send ChronoTime to OSC server '''
		try:
			while self.isRunning:
				elapsedTime = time() - self.timeInit
				msg = json.dumps({"type": "chrono", "chrono": elapsedTime})
				asyncio.run(self.sendWebsocket(msg))
				sleep(self.chronoTime)
		except:
			pass

	def addPlayerTurn(self):
		''' add one to player dictionary turn '''
		try:
			playerList = Clock.playing
			for p in playerList:
				if p in self.playerCounter.keys():
					self.playerCounter[p] += 1
				else:
					self.playerCounter[p] = 1
			# Clean non playing player
			delplayer = [
				k for k in self.playerCounter.keys() if k not in playerList]
			for d in delplayer:
				self.playerCounter.pop(d, None)
		except Exception as err:
			print("addPlayerTurn problem : ", err)

	def sendOnce(self, txt, helpType=""):
		''' send on txt msg to OSC '''
		msg = json.dumps({"type": "help", "helpType": helpType, "help": txt})
		asyncio.run(self.sendWebsocket(msg))

	def stop(self):
		self.isRunning = False

	def start(self):
		self.isRunning = True
		self.threadScale.start()
		self.threadRoot.start()
		self.threadBeat.start()
		self.threadPlayer.start()
		self.threadChrono.start()

try:
	wsPanel = WebFoxDotPanelWs()
except Exception as e:
	print(f"Error starting FoxDot WebSocket server: {e}")

def unsolo():
    ''' Unsolo all soloed players'''
    for p in Clock.playing:
        p.solo(0)
