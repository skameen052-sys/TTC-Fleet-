import subprocess, time, json, urllib.request, asyncio, websockets, base64, os

SCREENSHOTS_DIR = r"C:\Users\acer\.gemini\antigravity\brain\c6a63ca7-c81d-4eb9-9588-533070e51163"

portals_to_test = [
    {
        'id': 'login',
        'name': 'Login Page',
        'url': 'http://localhost:3000/',
        'setup': "localStorage.clear(); sessionStorage.clear(); window.location.href = 'http://localhost:3000/';",
        'screenshot': 'verify_login_page.png'
    },
    {
        'id': 'finance_login_tab',
        'name': 'Unified Login Page - Finance Tab Clicked',
        'url': 'http://localhost:3000/',
        'setup': """
            localStorage.clear(); sessionStorage.clear();
            window.location.href = 'http://localhost:3000/';
            setTimeout(() => {
                const btns = Array.from(document.querySelectorAll('.portal-pill-btn'));
                const finBtn = btns.find(b => b.innerText.includes('Finance'));
                if (finBtn) finBtn.click();
            }, 800);
        """,
        'screenshot': 'verify_unified_finance_login.png'
    },
    {
        'id': 'admin',
        'name': 'Admin Dashboard',
        'url': 'http://localhost:3000/?portal=admin',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Admin', role: 'ROLE_ADMIN', email: 'admin@ttcfleet360.com', portal: 'admin'
            }));
            window.location.href = 'http://localhost:3000/?portal=admin';
        """,
        'screenshot': 'verify_admin_dashboard.png'
    },
    {
        'id': 'manager',
        'name': 'Fleet Manager Dashboard',
        'url': 'http://localhost:3000/?portal=manager',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Vikram Malhotra', role: 'ROLE_MANAGER', email: 'manager@ttcfleet360.com', portal: 'manager'
            }));
            window.location.href = 'http://localhost:3000/?portal=manager';
        """,
        'screenshot': 'verify_fleet_manager.png'
    },
    {
        'id': 'driver',
        'name': 'Driver Portal Dashboard',
        'url': 'http://localhost:3000/?portal=driver',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Marcus Vance', role: 'ROLE_DRIVER', email: 'm.vance@fleet360.ttc.com', portal: 'driver'
            }));
            window.location.href = 'http://localhost:3000/?portal=driver';
        """,
        'screenshot': 'verify_driver_portal.png'
    },
    {
        'id': 'warehouse',
        'name': 'Warehouse OS Dashboard',
        'url': 'http://localhost:3000/?portal=warehouse',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Ethan Cole', role: 'ROLE_WAREHOUSE_MANAGER', email: 'ethan.cole@fleet360.ttc.com', portal: 'warehouse'
            }));
            window.location.href = 'http://localhost:3000/?portal=warehouse';
        """,
        'screenshot': 'verify_warehouse_dashboard.png'
    },
    {
        'id': 'logistics',
        'name': 'Logistics Operations Dashboard',
        'url': 'http://localhost:3000/?portal=logistics',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Elena Rostova', role: 'ROLE_LOGISTICS_MANAGER', email: 'elena.rostova@fleet360.ttc.com', portal: 'logistics'
            }));
            window.location.href = 'http://localhost:3000/?portal=logistics';
        """,
        'screenshot': 'verify_logistics_dashboard.png'
    },
    {
        'id': 'customer',
        'name': 'Customer Portal Dashboard',
        'url': 'http://localhost:3000/?portal=customer',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Sarah Jenkins', role: 'ROLE_CUSTOMER', email: 'customer@ttcfleet360.com', portal: 'customer', customerId: 'CUST-8021'
            }));
            window.location.href = 'http://localhost:3000/?portal=customer';
        """,
        'screenshot': 'verify_customer_dashboard.png'
    },
    {
        'id': 'billing_login',
        'name': 'Billing & Finance Manager Login Page',
        'url': 'http://localhost:3000/?portal=billing',
        'setup': """
            localStorage.clear(); sessionStorage.clear();
            window.location.href = 'http://localhost:3000/?portal=billing';
        """,
        'screenshot': 'verify_billing_login.png'
    },
    {
        'id': 'billing_dashboard',
        'name': 'Billing & Finance Manager Dashboard',
        'url': 'http://localhost:3000/?portal=billing',
        'setup': """
            localStorage.setItem('ttc_auth_token', 'jwt_verified_test_token');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Devin Vance', role: 'ROLE_FINANCE_MANAGER', email: 'finance@ttcfleet360.com', portal: 'billing', title: 'Chief Financial Controller'
            }));
            window.location.href = 'http://localhost:3000/?portal=billing';
        """,
        'screenshot': 'verify_billing_dashboard.png'
    }
]

async def run():
    chrome_proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--window-size=1440,900',
        '--remote-debugging-port=9258',
        'http://localhost:3000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9258/json').read())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url, max_size=30*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Page.enable'}))
            
            cmd_id = 100
            for item in portals_to_test:
                print(f"\n==========================================")
                print(f"TESTING: {item['name']} ({item['id']})")
                print(f"==========================================")
                
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Runtime.evaluate', 'params': {'expression': item['setup']}}))
                await asyncio.sleep(3.0)
                
                # Check for layout errors, console errors, horizontal overflow
                inspect_code = """
                (() => {
                    const docEl = document.documentElement;
                    const body = document.body;
                    const hasHorizontalOverflow = docEl.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;
                    const sidebar = document.querySelector('.fleet-sidebar, .dashboard-sidebar');
                    const header = document.querySelector('.fleet-header, header');
                    const mainWrapper = document.querySelector('.main-wrapper, .dashboard-main');
                    
                    const sidebarRect = sidebar ? {
                        x: Math.round(sidebar.getBoundingClientRect().x),
                        y: Math.round(sidebar.getBoundingClientRect().y),
                        w: Math.round(sidebar.getBoundingClientRect().width),
                        h: Math.round(sidebar.getBoundingClientRect().height)
                    } : null;
                    
                    const headerRect = header ? {
                        x: Math.round(header.getBoundingClientRect().x),
                        y: Math.round(header.getBoundingClientRect().y),
                        w: Math.round(header.getBoundingClientRect().width),
                        h: Math.round(header.getBoundingClientRect().height)
                    } : null;

                    const mainRect = mainWrapper ? {
                        x: Math.round(mainWrapper.getBoundingClientRect().x),
                        y: Math.round(mainWrapper.getBoundingClientRect().y),
                        w: Math.round(mainWrapper.getBoundingClientRect().width),
                        h: Math.round(mainWrapper.getBoundingClientRect().height)
                    } : null;

                    // Check for any text overflowing or blank page
                    const pageTextLength = body.innerText.trim().length;
                    const isBlank = pageTextLength < 50;

                    // Collect all portal pills if on login page
                    const pills = Array.from(document.querySelectorAll('.portal-pill-btn')).map(b => b.innerText.trim());

                    return {
                        hasHorizontalOverflow,
                        windowWidth: window.innerWidth,
                        docScrollWidth: docEl.scrollWidth,
                        bodyScrollWidth: body.scrollWidth,
                        sidebarRect,
                        headerRect,
                        mainRect,
                        pageTextLength,
                        isBlank,
                        pills
                    };
                })()
                """
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Runtime.evaluate', 'params': {'expression': inspect_code, 'returnByValue': True}}))
                
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cmd_id:
                        result = resp.get('result', {}).get('result', {}).get('value', {})
                        print("Analysis result:", json.dumps(result, indent=2))
                        break
                
                # Screenshot
                cmd_id += 1
                await ws.send(json.dumps({'id': cmd_id, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cmd_id:
                        img_bytes = base64.b64decode(resp['result']['data'])
                        target_file = os.path.join(SCREENSHOTS_DIR, item['screenshot'])
                        with open(target_file, 'wb') as f:
                            f.write(img_bytes)
                        print(f"Captured: {target_file} ({len(img_bytes)} bytes)")
                        break
                        
    finally:
        chrome_proc.terminate()
        try:
            chrome_proc.wait(timeout=3)
        except:
            chrome_proc.kill()

if __name__ == '__main__':
    asyncio.run(run())
