import subprocess, time, json, urllib.request, asyncio, websockets

async def check():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9253',
        'http://localhost:3000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9253/json').read())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Log.enable'}))
            
            # Test Manager portal
            setup_manager = """
            localStorage.setItem('ttc_auth_token', 'jwt_test');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Alexandre Mercer',
                role: 'ROLE_MANAGER',
                email: 'manager@ttcfleet360.com',
                portal: 'manager'
            }));
            window.location.href = 'http://localhost:3000/?portal=manager';
            """
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': setup_manager}}))
            await asyncio.sleep(2.5)
            
            # Check what's rendered in Manager portal
            inspect_manager = """
            (() => {
                const body = document.body;
                const appContainer = document.querySelector('.app-container');
                const sidebar = document.querySelector('.fleet-sidebar');
                const mainWrapper = document.querySelector('.main-wrapper');
                const content = document.querySelector('.dashboard-content');
                const errors = window.__lastErrors || [];
                
                return JSON.stringify({
                    url: window.location.href,
                    bodyWidth: body ? body.offsetWidth : 0,
                    bodyScrollWidth: body ? body.scrollWidth : 0,
                    appContainerFound: Boolean(appContainer),
                    appContainerRect: appContainer ? appContainer.getBoundingClientRect() : null,
                    sidebarFound: Boolean(sidebar),
                    sidebarRect: sidebar ? sidebar.getBoundingClientRect() : null,
                    sidebarDisplay: sidebar ? window.getComputedStyle(sidebar).display : null,
                    sidebarPosition: sidebar ? window.getComputedStyle(sidebar).position : null,
                    sidebarTransform: sidebar ? window.getComputedStyle(sidebar).transform : null,
                    mainWrapperFound: Boolean(mainWrapper),
                    mainWrapperRect: mainWrapper ? mainWrapper.getBoundingClientRect() : null,
                    contentFound: Boolean(content),
                    contentRect: content ? content.getBoundingClientRect() : null,
                    hasWhiteOverlayOrBg: document.querySelector('.driver-portal-theme') !== null,
                    domTextSummary: document.body.innerText.substring(0, 300)
                });
            })()
            """
            await ws.send(json.dumps({'id': 4, 'method': 'Runtime.evaluate', 'params': {'expression': inspect_manager}}))
            msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
            res = json.loads(msg)
            while res.get('id') != 4:
                msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
                res = json.loads(msg)
            print("MANAGER PORTAL INSPECTION:", res.get('result', {}).get('result', {}).get('value'))
            
    finally:
        proc.terminate()

asyncio.run(check())
