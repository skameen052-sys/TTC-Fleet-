import subprocess, time, json, urllib.request, asyncio, websockets, base64, os

SCREENSHOTS_DIR = r"C:\Users\acer\.gemini\antigravity\brain\c6a63ca7-c81d-4eb9-9588-533070e51163"

portals_to_test = [
    {
        'portal': 'admin',
        'name': 'Admin Dashboard',
        'user': {
            'fullName': 'Admin',
            'role': 'ROLE_ADMIN',
            'email': 'admin@ttcfleet360.com',
            'portal': 'admin'
        },
        'screenshot': 'admin_dashboard_verified.png'
    },
    {
        'portal': 'manager',
        'name': 'Fleet Manager Dashboard',
        'user': {
            'fullName': 'Vikram Malhotra',
            'role': 'ROLE_MANAGER',
            'email': 'manager@ttcfleet360.com',
            'portal': 'manager'
        },
        'screenshot': 'fleet_manager_dashboard_verified.png'
    },
    {
        'portal': 'driver',
        'name': 'Driver Portal Dashboard',
        'user': {
            'fullName': 'Marcus Vance',
            'role': 'ROLE_DRIVER',
            'email': 'm.vance@fleet360.ttc.com',
            'portal': 'driver'
        },
        'screenshot': 'driver_dashboard_verified.png'
    },
    {
        'portal': 'maintenance',
        'name': 'Maintenance & Asset Health Dashboard',
        'user': {
            'fullName': 'Dave Kowalski',
            'role': 'ROLE_MAINTENANCE_MANAGER',
            'email': 'maintenance@ttcfleet360.com',
            'portal': 'maintenance'
        },
        'screenshot': 'maintenance_dashboard_verified.png'
    }
]

async def run_verification():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--window-size=1440,900',
        '--remote-debugging-port=9254',
        'http://localhost:3000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9254/json').read())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Page.enable'}))
            
            cmd_id = 10
            
            for item in portals_to_test:
                print(f"\n==========================================")
                print(f"VERIFYING: {item['name']} (portal={item['portal']})")
                print(f"==========================================")
                
                # Setup session and navigate
                setup_script = f"""
                localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({json.dumps(item['user'])}));
                window.location.href = 'http://localhost:3000/?portal={item['portal']}';
                """
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Runtime.evaluate', 'params': {'expression': setup_script}}))
                
                await asyncio.sleep(3.0)
                
                # Evaluate DOM layout and elements
                inspect_script = """
                (() => {
                    const body = document.body;
                    const sidebar = document.querySelector('.fleet-sidebar, .dashboard-sidebar');
                    const mainWrapper = document.querySelector('.main-wrapper, .dashboard-main');
                    const text = body.innerText;
                    
                    return JSON.stringify({
                        url: window.location.href,
                        sidebarFound: Boolean(sidebar),
                        sidebarRect: sidebar ? {
                            x: Math.round(sidebar.getBoundingClientRect().x),
                            width: Math.round(sidebar.getBoundingClientRect().width)
                        } : null,
                        mainWrapperFound: Boolean(mainWrapper),
                        mainWrapperRect: mainWrapper ? {
                            x: Math.round(mainWrapper.getBoundingClientRect().x),
                            width: Math.round(mainWrapper.getBoundingClientRect().width)
                        } : null,
                        textSnippet: text.substring(0, 200).replace(/\\n/g, ' ')
                    });
                })()
                """
                cmd_id += 1
                req_id = cmd_id
                await ws.send(json.dumps({'id': req_id, 'method': 'Runtime.evaluate', 'params': {'expression': inspect_script}}))
                
                while True:
                    msg = await asyncio.wait_for(ws.recv(), timeout=8.0)
                    data = json.loads(msg)
                    if data.get('id') == req_id:
                        val = json.loads(data['result']['result']['value'])
                        print(f"URL: {val['url']}")
                        print(f"Sidebar: {val['sidebarRect']}")
                        print(f"Main Area: {val['mainWrapperRect']}")
                        print(f"Text Snippet: {val['textSnippet'][:120]}...")
                        break
                
                # Capture screenshot
                cmd_id += 1
                shot_id = cmd_id
                await ws.send(json.dumps({'id': shot_id, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
                
                while True:
                    msg = await asyncio.wait_for(ws.recv(), timeout=10.0)
                    data = json.loads(msg)
                    if data.get('id') == shot_id:
                        img_bytes = base64.b64decode(data['result']['data'])
                        filepath = os.path.join(SCREENSHOTS_DIR, item['screenshot'])
                        with open(filepath, 'wb') as f:
                            f.write(img_bytes)
                        print(f"Saved Screenshot: {filepath}")
                        break
                        
    finally:
        proc.terminate()

asyncio.run(run_verification())
