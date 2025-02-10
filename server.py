import json
import asyncio
import websockets
from subprocess import Popen, PIPE
import os

async def load_config():
    try:
        with open('config.json', 'r') as f:
            return json.load(f)
    except Exception as error:
        raise Exception(f"Error reading config file: {str(error)}")

async def broadcast_log(message, clients):
    for client in clients:
        await client.send(json.dumps({"type": "foxdot_log", "data": message, "color": None}))

async def handle_websocket(websocket, path, foxdot_process, clients):
    print("New client connected")
    clients.add(websocket)
    
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if data["type"] == "evaluate_code":
                    code = data["code"]
                    await broadcast_log(f">> {code}", clients)
                    foxdot_process.stdin.write(f"{code}\n\n".encode())
                    foxdot_process.stdin.flush()
            except json.JSONDecodeError:
                # Ignore non-JSON messages
                pass
    finally:
        clients.remove(websocket)
        print("Client disconnected")

async def main():
    config = await load_config()
    
    # Start FoxDot
    foxdot_process = Popen(
        ['python', '-m', 'FoxDot', '-p'],
        cwd=config["FOXDOT_PATH"],
        stdin=PIPE,
        stdout=PIPE,  
        stderr=PIPE, 
        env={**os.environ, "PYTHONUNBUFFERED": "1"}
    )
    
    print(f"FoxDot started, pid: {foxdot_process.pid}")
    
    # Set of connected clients
    clients = set()
    
    # Fonction pour gérer les logs FoxDot
    async def handle_foxdot_output():
        stout = []
        while True:
            line = await asyncio.get_event_loop().run_in_executor(
                None, 
                foxdot_process.stdout.readline
            )
            stout.append(line.decode().strip())
            if line == '' and foxdot_process.poll() is not None:
                break
            # print(log_message)
            await broadcast_log(''.join(stout), clients)

    # Démarrer la tâche de gestion des logs en arrière-plan
    asyncio.create_task(handle_foxdot_output())

    # Start WebSocket server
    async with websockets.serve(
        lambda ws, path: handle_websocket(ws, path, foxdot_process, clients),
        "localhost",
        1234
    ):
        print("WebSocket server started on port 1234")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())