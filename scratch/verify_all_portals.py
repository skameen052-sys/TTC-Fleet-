import subprocess, time, json, urllib.request, asyncio, websockets, base64, os

SCREENSHOTS_DIR = r"C:\Users\acer\.gemini\antigravity\brain\c6a63ca7-c81d-4eb9-9588-533070e51163"

portals_to_test = [
    {
        'portal': 'login',
        'name': 'Login Page (5 Portals Only)',
        'setup': """
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'http://localhost:3000/';
        """,
        'inspect': """
            (() => {
                const pills = Array.from(document.querySelectorAll('.portal-pill-btn')).map(b => b.innerText.trim());
                return JSON.stringify({
                    pills: pills,
                    hasMaint: pills.some(p => p.toLowerCase().includes('maint')),
                    bodyTextSnippet: document.body.innerText.slice(0, 300)
                });
            })()
        """,
        'screenshot': 'login_page_no_maint.png'
    },
    {
        'portal': 'admin',
        'name': 'Admin Dashboard',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Admin', role: 'ROLE_ADMIN', email: 'admin@ttcfleet360.com', portal: 'admin'
            }));
            window.location.href = 'http://localhost:3000/?portal=admin';
        """,
        'inspect': """
            (() => {
                const sidebar = document.querySelector('.fleet-sidebar, .dashboard-sidebar');
                const mainWrapper = document.querySelector('.main-wrapper, .dashboard-main');
                return JSON.stringify({
                    sidebarFound: Boolean(sidebar),
                    sidebarRect: sidebar ? {
                        x: Math.round(sidebar.getBoundingClientRect().x),
                        width: Math.round(sidebar.getBoundingClientRect().width)
                    } : null,
                    mainRect: mainWrapper ? {
                        x: Math.round(mainWrapper.getBoundingClientRect().x),
                        width: Math.round(mainWrapper.getBoundingClientRect().width)
                    } : null
                });
            })()
        """,
        'screenshot': 'admin_dashboard_verified.png'
    },
    {
        'portal': 'manager',
        'name': 'Fleet Manager Dashboard',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Vikram Malhotra', role: 'ROLE_MANAGER', email: 'manager@ttcfleet360.com', portal: 'manager'
            }));
            window.location.href = 'http://localhost:3000/?portal=manager';
        """,
        'inspect': """
            (() => {
                const sidebar = document.querySelector('.fleet-sidebar, .dashboard-sidebar');
                const mainWrapper = document.querySelector('.main-wrapper, .dashboard-main');
                return JSON.stringify({
                    sidebarFound: Boolean(sidebar),
                    sidebarRect: sidebar ? {
                        x: Math.round(sidebar.getBoundingClientRect().x),
                        width: Math.round(sidebar.getBoundingClientRect().width)
                    } : null,
                    mainRect: mainWrapper ? {
                        x: Math.round(mainWrapper.getBoundingClientRect().x),
                        width: Math.round(mainWrapper.getBoundingClientRect().width)
                    } : null
                });
            })()
        """,
        'screenshot': 'fleet_manager_dashboard_verified.png'
    },
    {
        'portal': 'driver',
        'name': 'Driver Portal Dashboard',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Marcus Vance', role: 'ROLE_DRIVER', email: 'm.vance@fleet360.ttc.com', portal: 'driver'
            }));
            window.location.href = 'http://localhost:3000/?portal=driver';
        """,
        'inspect': """
            (() => {
                const sidebar = document.querySelector('.fleet-sidebar, .dashboard-sidebar');
                const mainWrapper = document.querySelector('.main-wrapper, .dashboard-main');
                return JSON.stringify({
                    sidebarFound: Boolean(sidebar),
                    sidebarRect: sidebar ? {
                        x: Math.round(sidebar.getBoundingClientRect().x),
                        width: Math.round(sidebar.getBoundingClientRect().width)
                    } : null,
                    mainRect: mainWrapper ? {
                        x: Math.round(mainWrapper.getBoundingClientRect().x),
                        width: Math.round(mainWrapper.getBoundingClientRect().width)
                    } : null
                });
            })()
        """,
        'screenshot': 'driver_dashboard_verified.png'
    }
]

async def run_verification():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--window-size=1440,900',
        '--remote-debugging-port=9255',
        'http://localhost:3000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9255/json').read())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Page.enable'}))
            
            cmd_id = 10
            
            for item in portals_to_test:
                print(f"\n==========================================")
                print(f"VERIFYING: {item['name']}")
                print(f"==========================================")
                
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Runtime.evaluate', 'params': {'expression': item['setup']}}))
                
                await asyncio.sleep(2.5)
                
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Runtime.evaluate', 'params': {'expression': item['inspect'], 'returnByValue': True}}))
                
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cmd_id:
                        res_val = resp.get('result', {}).get('result', {}).get('value', '{}')
                        data = json.loads(res_val) if isinstance(res_val, str) else res_val
                        print("Inspection result:", json.dumps(data, indent=2))
                        break
                        
                # Take screenshot
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
                
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cmd_id:
                        img_bytes = base64.b64decode(resp['result']['data'])
                        target_file = os.path.join(SCREENSHOTS_DIR, item['screenshot'])
                        with open(target_file, 'wb') as f:
                            f.write(img_bytes)
                        print(f"Saved screenshot: {target_file} ({len(img_bytes)} bytes)")
                        break
                        
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except:
            proc.kill()

if __name__ == '__main__':
    asyncio.run(run_verification())
