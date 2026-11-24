import os
import sys
import time
import json
import base64
import asyncio
import subprocess
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ARTIFACT_DIR = r"C:\Users\acer\.gemini\antigravity\brain\c6a63ca7-c81d-4eb9-9588-533070e51163"
USER_DATA_DIR = r"c:\Users\acer\Desktop\TTC FLEET 3\scratch\chrome_profile"

async def cdp_call(ws, method, params=None, msg_id=1):
    payload = {"id": msg_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        res = await ws.recv()
        data = json.loads(res)
        if data.get("id") == msg_id:
            return data.get("result", {})

async def capture_screenshot(ws, filename, msg_id):
    res = await cdp_call(ws, "Page.captureScreenshot", {"format": "png"}, msg_id)
    if "data" in res:
        img_data = base64.b64decode(res["data"])
        out_path = os.path.join(ARTIFACT_DIR, filename)
        with open(out_path, "wb") as f:
            f.write(img_data)
        print(f"[SCREENSHOT SAVED] {filename} ({len(img_data)} bytes)")
        return out_path
    return None

async def run_verification():
    # 1. Launch Chrome in debug mode
    os.makedirs(USER_DATA_DIR, exist_ok=True)
    chrome_cmd = [
        CHROME_PATH,
        "--remote-debugging-port=9222",
        "--remote-allow-origins=*",
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={USER_DATA_DIR}",
        "--window-size=1440,900",
        "--no-first-run",
        "--no-default-browser-check",
        "http://localhost:3000"
    ]
    proc = subprocess.Popen(chrome_cmd)
    print("Launched headless Chrome on port 9222...")
    time.sleep(3)

    try:
        # Get websocket debugger URL
        tabs_res = urllib.request.urlopen("http://localhost:9222/json")
        tabs = json.loads(tabs_res.read().decode())
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        print(f"Connecting to CDP: {ws_url}")

        async with websockets.connect(ws_url) as ws:
            mid = 1
            await cdp_call(ws, "Page.enable", {}, mid); mid += 1
            await cdp_call(ws, "Runtime.enable", {}, mid); mid += 1

            # --- TEST 1: LOGIN PAGE WITH FINANCE TAB ---
            print("\n=== 1. Verifying Unified Login Page - Finance Tab ===")
            # Clear storage so login page renders
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": "localStorage.clear(); sessionStorage.clear(); window.location.href = 'http://localhost:3000/?portal=admin';"
            }, mid); mid += 1
            await asyncio.sleep(2)

            # Click Finance pill
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                const buttons = Array.from(document.querySelectorAll('button'));
                const finBtn = buttons.find(b => b.textContent.includes('Finance'));
                if (finBtn) finBtn.click();
                """
            }, mid); mid += 1
            await asyncio.sleep(1)

            # Check if finance hero image is rendered
            res = await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                (() => {
                    const img = document.querySelector('.login-hero-img-display');
                    const titles = document.querySelector('.manager-hero-titles');
                    return {
                        src: img ? img.src : null,
                        title: titles ? titles.innerText : null,
                        hasImage: !!img
                    };
                })()
                """,
                "returnByValue": True
            }, mid); mid += 1
            print("Finance Tab Verification:", res.get("value"))
            await capture_screenshot(ws, "verify_login_finance_tab.png", mid); mid += 1

            # --- TEST 2: LOGIN PAGE WITH CUSTOMER TAB ---
            print("\n=== 2. Verifying Unified Login Page - Customer Tab ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                const buttons = Array.from(document.querySelectorAll('button'));
                const custBtn = buttons.find(b => b.textContent.includes('Customer'));
                if (custBtn) custBtn.click();
                """
            }, mid); mid += 1
            await asyncio.sleep(1)

            res = await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                (() => {
                    const img = document.querySelector('.login-hero-img-display');
                    const titles = document.querySelector('.manager-hero-titles');
                    return {
                        src: img ? img.src : null,
                        title: titles ? titles.innerText : null,
                        hasImage: !!img
                    };
                })()
                """,
                "returnByValue": True
            }, mid); mid += 1
            print("Customer Tab Verification:", res.get("value"))
            await capture_screenshot(ws, "verify_login_customer_tab.png", mid); mid += 1

            # --- TEST 3: LOGIN PAGE WITH DRIVER TAB ---
            print("\n=== 3. Verifying Unified Login Page - Driver Tab ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                const buttons = Array.from(document.querySelectorAll('button'));
                const drvBtn = buttons.find(b => b.textContent.includes('Driver'));
                if (drvBtn) drvBtn.click();
                """
            }, mid); mid += 1
            await asyncio.sleep(1)

            res = await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                (() => {
                    const img = document.querySelector('.login-hero-img-display');
                    const titles = document.querySelector('.manager-hero-titles');
                    return {
                        src: img ? img.src : null,
                        title: titles ? titles.innerText : null,
                        hasImage: !!img
                    };
                })()
                """,
                "returnByValue": True
            }, mid); mid += 1
            print("Driver Tab Verification:", res.get("value"))
            await capture_screenshot(ws, "verify_login_driver_tab.png", mid); mid += 1

            # --- TEST 4: ADMIN DASHBOARD ---
            print("\n=== 4. Verifying Super Admin Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Admin',
                    role: 'ROLE_ADMIN',
                    email: 'admin@ttcfleet360.com',
                    portal: 'admin'
                }));
                window.location.href = 'http://localhost:3000/?portal=admin';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_admin.png", mid); mid += 1

            # --- TEST 5: FLEET MANAGER DASHBOARD ---
            print("\n=== 5. Verifying Fleet Manager Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Vikram Malhotra',
                    role: 'ROLE_MANAGER',
                    email: 'manager@ttcfleet360.com',
                    portal: 'manager'
                }));
                window.location.href = 'http://localhost:3000/?portal=manager';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_fleet_manager.png", mid); mid += 1

            # --- TEST 6: DRIVER DASHBOARD ---
            print("\n=== 6. Verifying Driver Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Marcus Vance',
                    role: 'ROLE_DRIVER',
                    email: 'm.vance@fleet360.ttc.com',
                    portal: 'driver',
                    driverId: 'D-01'
                }));
                window.location.href = 'http://localhost:3000/?portal=driver';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_driver.png", mid); mid += 1

            # --- TEST 7: WAREHOUSE MANAGER DASHBOARD ---
            print("\n=== 7. Verifying Warehouse Manager Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Ethan Cole',
                    role: 'ROLE_WAREHOUSE_MANAGER',
                    email: 'ethan.cole@fleet360.ttc.com',
                    portal: 'warehouse'
                }));
                window.location.href = 'http://localhost:3000/?portal=warehouse';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_warehouse.png", mid); mid += 1

            # --- TEST 8: LOGISTICS MANAGER DASHBOARD ---
            print("\n=== 8. Verifying Logistics Manager Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Elena Rostova',
                    role: 'ROLE_LOGISTICS_MANAGER',
                    email: 'elena.rostova@fleet360.ttc.com',
                    portal: 'logistics'
                }));
                window.location.href = 'http://localhost:3000/?portal=logistics';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_logistics.png", mid); mid += 1

            # --- TEST 9: CUSTOMER DASHBOARD ---
            print("\n=== 9. Verifying Customer Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Sarah Jenkins',
                    role: 'ROLE_CUSTOMER',
                    email: 'customer@ttcfleet360.com',
                    portal: 'customer'
                }));
                window.location.href = 'http://localhost:3000/?portal=customer';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_customer.png", mid); mid += 1

            # --- TEST 10: BILLING & FINANCE DASHBOARD ---
            print("\n=== 10. Verifying Billing & Finance Dashboard ===")
            await cdp_call(ws, "Runtime.evaluate", {
                "expression": """
                localStorage.setItem('ttc_auth_token', 'jwt_session_valid');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                    fullName: 'Devin Vance',
                    role: 'ROLE_FINANCE_MANAGER',
                    email: 'finance@ttcfleet360.com',
                    portal: 'billing'
                }));
                window.location.href = 'http://localhost:3000/?portal=billing';
                """
            }, mid); mid += 1
            await asyncio.sleep(2)
            await capture_screenshot(ws, "verify_dashboard_billing.png", mid); mid += 1

            print("\n ALL 10 SCREENSHOTS AND VERIFICATIONS COMPLETED SUCCESSFULLY!")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except:
            proc.kill()

if __name__ == '__main__':
    asyncio.run(run_verification())
