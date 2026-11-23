import subprocess, time, json, urllib.request, asyncio, websockets

async def inspect_driver_error():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9255',
        'http://localhost:3000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9255/json').read())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Log.enable'}))
            
            setup_script = """
            localStorage.setItem('ttc_auth_token', 'jwt_test');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Marcus Vance',
                role: 'ROLE_DRIVER',
                email: 'm.vance@fleet360.ttc.com',
                portal: 'driver'
            }));
            window.location.href = 'http://localhost:3000/?portal=driver';
            """
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': setup_script}}))
            
            # Listen to console / runtime exceptions
            start = time.time()
            while time.time() - start < 6.0:
                msg = await asyncio.wait_for(ws.recv(), timeout=6.0)
                d = json.loads(msg)
                if d.get('method') == 'Runtime.exceptionThrown':
                    print("EXCEPTION:", json.dumps(d['params']['exceptionDetails'], indent=2))
                elif d.get('method') == 'Runtime.consoleAPICalled':
                    args = [a.get('value') or a.get('description') for a in d['params']['args']]
                    if d['params']['type'] == 'error':
                        print("CONSOLE ERROR:", args)
    finally:
        proc.terminate()

asyncio.run(inspect_driver_error())
