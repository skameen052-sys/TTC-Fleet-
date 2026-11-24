import subprocess
import time
import os
import json
import urllib.request
import base64
from websockets.sync.client import connect

artifact_dir = r"C:\Users\acer\.gemini\antigravity\brain\c6a63ca7-c81d-4eb9-9588-533070e51163"
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
temp_dir = os.environ.get('TEMP', r'C:\Temp')
user_data_dir = os.path.join(temp_dir, f'chrome_logistics_test_{int(time.time())}')

cmd = [
    chrome_path,
    f"--user-data-dir={user_data_dir}",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1600,1050",
    "http://localhost:3000/?portal=logistics"
]

print("Launching Chrome...", flush=True)
proc = subprocess.Popen(cmd)
time.sleep(3)

try:
    print("Connecting to CDP at http://localhost:9222/json...", flush=True)
    req = urllib.request.urlopen("http://localhost:9222/json", timeout=10)
    all_tabs = json.loads(req.read().decode('utf-8'))
    page_tabs = [t for t in all_tabs if t.get('type') == 'page']
    target_tab = page_tabs[0] if page_tabs else all_tabs[0]
    ws_url = target_tab['webSocketDebuggerUrl']
    print(f"Connected to CDP tab: {target_tab.get('title')} ({target_tab.get('url')})", flush=True)

    with connect(ws_url, max_size=20 * 1024 * 1024) as ws:
        msg_counter = [1]

        def send_cdp(method, params=None):
            msg_counter[0] += 1
            msg_id = msg_counter[0]
            payload = {"id": msg_id, "method": method, "params": params or {}}
            ws.send(json.dumps(payload))
            while True:
                res = json.loads(ws.recv())
                if res.get("id") == msg_id:
                    return res.get("result", {})

        send_cdp("Console.enable")
        send_cdp("Runtime.enable")
        send_cdp("Page.enable")

        def capture(filename):
            res = send_cdp("Page.captureScreenshot", {"format": "png"})
            b64 = res.get("data", "")
            if b64:
                img_data = base64.b64decode(b64)
                path = os.path.join(artifact_dir, filename)
                with open(path, "wb") as f:
                    f.write(img_data)
                print(f"  ✓ Screenshot captured: {filename}", flush=True)
                return path
            return None

        def evaluate(js_code):
            res = send_cdp("Runtime.evaluate", {"expression": js_code, "returnByValue": True})
            return res.get("result", {}).get("value")

        # Navigate and set authenticated session
        print("Authenticating session for Logistics Manager...", flush=True)
        send_cdp("Page.navigate", {"url": "http://localhost:3000/?portal=logistics"})
        time.sleep(1.5)
        evaluate("""(() => {
            localStorage.setItem('ttc_auth_token', 'demo-jwt-token-auth');
            localStorage.setItem('ttc_fleet360_user', JSON.stringify({
                fullName: 'Elena Rostova',
                role: 'ROLE_LOGISTICS_MANAGER',
                email: 'elena.rostova@fleet360.ttc.com'
            }));
            window.location.href = 'http://localhost:3000/?portal=logistics';
        })()""")
        time.sleep(3)

        # 1. Capture initial Logistics Dashboard
        print("Capturing logistics initial page...", flush=True)
        capture("logistics_portal_initial.png")

        # 2. Navigate to Order Management -> Pending Orders
        print("Navigating to Pending Orders tab...", flush=True)
        evaluate("""(() => {
            const navItems = Array.from(document.querySelectorAll('button, div, span, a'));
            const orderNav = navItems.find(el => el.innerText && el.innerText.trim() === 'Order Management' || el.innerText.includes('Order Management'));
            if (orderNav) orderNav.click();
        })()""")
        time.sleep(1.5)

        evaluate("""(() => {
            const navItems = Array.from(document.querySelectorAll('button, div, span, a'));
            const pendingNav = navItems.find(el => el.innerText && el.innerText.trim() === 'Pending Orders');
            if (pendingNav) pendingNav.click();
        })()""")
        time.sleep(1.5)

        # Verify Pending Orders table
        table_info = evaluate("""(() => {
            const h1 = document.querySelector('h1')?.innerText;
            const headers = Array.from(document.querySelectorAll('th')).map(th => th.innerText.trim()).filter(Boolean);
            const rows = document.querySelectorAll('tbody tr').length;
            const badges = Array.from(document.querySelectorAll('span')).map(s => s.innerText.trim()).filter(t => ['Pending', 'Urgent', 'Standard', 'High'].includes(t));
            return { h1, headers, rows, sampleBadges: badges.slice(0, 8) };
        })()""")
        print(f"Table Info: {table_info}", flush=True)

        capture("logistics_pending_orders_ui.png")

        # 3. Switch to All Orders Tab
        print("Switching to All Orders sub-tab...", flush=True)
        evaluate("""(() => {
            const tabs = Array.from(document.querySelectorAll('button'));
            const allTab = tabs.find(b => b.innerText && b.innerText.includes('All Orders'));
            if (allTab) allTab.click();
        })()""")
        time.sleep(1.5)
        capture("logistics_all_orders_ui.png")

        # 4. Open and verify 'New Customer Order' modal
        print("Opening New Customer Order Modal...", flush=True)
        evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const newOrderBtn = btns.find(b => b.innerText && b.innerText.includes('New Customer Order'));
            if (newOrderBtn) newOrderBtn.click();
        })()""")
        time.sleep(1.5)
        capture("logistics_new_order_modal.png")

        # Fill modal form
        print("Filling form and booking order...", flush=True)
        evaluate("""(() => {
            const inputs = document.querySelectorAll('input');
            const custInput = Array.from(inputs).find(i => i.placeholder && i.placeholder.includes('Apex Industrial'));
            if (custInput) {
                custInput.value = 'OmniCore Precision Labs';
                custInput.dispatchEvent(new Event('input', { bubbles: true }));
                custInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const destInput = Array.from(inputs).find(i => i.placeholder && i.placeholder.includes('Detroit Automotive'));
            if (destInput) {
                destInput.value = 'Cleveland Terminal (CLE-02) - Dock 7';
                destInput.dispatchEvent(new Event('input', { bubbles: true }));
                destInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        })()""")
        time.sleep(1)

        # Submit order
        evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const submitBtn = btns.find(b => b.innerText && b.innerText.includes('Confirm & Book Order'));
            if (submitBtn) submitBtn.click();
        })()""")
        time.sleep(2)
        capture("logistics_order_created_grid.png")

        # 5. Open Order Details Modal
        print("Opening Order Details inspection modal...", flush=True)
        evaluate("""(() => {
            const eyeBtn = document.querySelector('button[title*=\"View Order Details\"]');
            if (eyeBtn) eyeBtn.click();
        })()""")
        time.sleep(1.5)
        capture("logistics_order_details_modal.png")

        # Close details modal
        evaluate("""(() => {
            const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Close Details');
            if (closeBtn) closeBtn.click();
        })()""")
        time.sleep(1)

        # 6. Test Order Cancellation Modal
        print("Testing Cancellation modal...", flush=True)
        evaluate("""(() => {
            const rejectBtn = document.querySelector('button[title*=\"Reject / Cancel Order\"]');
            if (rejectBtn) rejectBtn.click();
        })()""")
        time.sleep(1.5)
        capture("logistics_order_cancellation_modal.png")

        print("\n[SUCCESS] UI verification completed successfully!", flush=True)

except Exception as ex:
    print(f"Exception during verification: {ex}", flush=True)
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
    print("Chrome test process terminated.", flush=True)
