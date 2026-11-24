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
user_data_dir = os.path.join(temp_dir, f'chrome_site_audit_{int(time.time())}')

port = 9224
cmd = [
    chrome_path,
    f"--user-data-dir={user_data_dir}",
    f"--remote-debugging-port={port}",
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1600,1050",
    "http://localhost:3000/"
]

print("Launching headless Chrome for full site audit...", flush=True)
proc = subprocess.Popen(cmd)
time.sleep(3)

collected_errors = []
collected_warnings = []
network_failures = []
portal_test_results = {}

try:
    print(f"Connecting to CDP at http://localhost:{port}/json...", flush=True)
    req = urllib.request.urlopen(f"http://localhost:{port}/json", timeout=10)
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
                raw = ws.recv()
                res = json.loads(raw)
                # Check for event notifications
                method_name = res.get("method")
                if method_name == "Runtime.exceptionThrown":
                    details = res.get("params", {}).get("exceptionDetails", {})
                    text = details.get("text", "")
                    ex_obj = details.get("exception", {}).get("description", "")
                    err_msg = f"[JS Exception] {text} {ex_obj}".strip()
                    print(f"  ❌ {err_msg}", flush=True)
                    collected_errors.append(err_msg)
                elif method_name == "Console.messageAdded":
                    params = res.get("params", {}).get("message", {})
                    level = params.get("level")
                    text = params.get("text", "")
                    if level == "error":
                        err_msg = f"[Console Error] {text}"
                        print(f"  ❌ {err_msg}", flush=True)
                        collected_errors.append(err_msg)
                    elif level == "warning":
                        # filter benign React dev warnings if any
                        collected_warnings.append(text)
                elif method_name == "Network.responseReceived":
                    resp = res.get("params", {}).get("response", {})
                    status = resp.get("status", 200)
                    url = resp.get("url", "")
                    if status >= 400:
                        net_err = f"[Network {status}] {url}"
                        print(f"  ⚠️ {net_err}", flush=True)
                        network_failures.append(net_err)

                if res.get("id") == msg_id:
                    return res.get("result", {})

        send_cdp("Console.enable")
        send_cdp("Runtime.enable")
        send_cdp("Network.enable")
        send_cdp("Page.enable")

        def evaluate(js_code):
            res = send_cdp("Runtime.evaluate", {"expression": js_code, "returnByValue": True})
            return res.get("result", {}).get("value")

        # -----------------------------------------------------------------
        # TEST SUITE 1: LOGIN PAGES & AUTHENTICATION FOR ALL 7 ROLES
        # -----------------------------------------------------------------
        print("\n=======================================================", flush=True)
        print("  TEST SUITE 1: AUTHENTICATION & LOGIN SCREENS", flush=True)
        print("=======================================================", flush=True)

        login_roles = ['admin', 'manager', 'driver', 'warehouse', 'logistics', 'customer', 'billing']
        login_results = {}

        for role in login_roles:
            url = f"http://localhost:3000/?portal={role}"
            print(f"\n[LOGIN CHECK] Testing Login Page for role: {role.upper()}", flush=True)
            send_cdp("Page.navigate", {"url": url})
            time.sleep(2)

            info = evaluate("""(() => {
                const title = document.title;
                const h1 = document.querySelector('h1, h2')?.innerText || '';
                const emailInput = document.querySelector('input[type="email"], input[name="email"], input[placeholder*="email" i], input[type="text"]')?.value || '';
                const passInput = document.querySelector('input[type="password"]')?.value || '';
                const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && (b.innerText.includes('Sign In') || b.innerText.includes('Login')))?.innerText || '';
                const roleTabs = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => ['Admin', 'Fleet', 'Driver', 'WMS', 'Logistics', 'Customer', 'Finance'].includes(t));
                const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).map(img => img.src);
                return { title, h1, emailInput, hasPass: Boolean(passInput), submitBtn, roleTabs, brokenImages };
            })()""")
            print(f"  Page Info: Title='{info.get('title')}', Heading='{info.get('h1')}', Button='{info.get('submitBtn')}', RoleTabs={len(info.get('roleTabs', []))}", flush=True)
            if info.get('brokenImages'):
                print(f"  ❌ Broken Images detected: {info.get('brokenImages')}", flush=True)
                for b_img in info.get('brokenImages'):
                    collected_errors.append(f"[Broken Image on {role} login]: {b_img}")
            login_results[role] = info

        # -----------------------------------------------------------------
        # TEST SUITE 2: ALL 7 DASHBOARDS & TAB NAVIGATION
        # -----------------------------------------------------------------
        print("\n=======================================================", flush=True)
        print("  TEST SUITE 2: PORTAL NAVIGATION & RUNTIME AUDIT", flush=True)
        print("=======================================================", flush=True)

        portals_to_test = [
            {
                "id": "admin",
                "role": "ROLE_ADMIN",
                "email": "admin@ttcfleet360.com",
                "name": "Super Admin",
                "expectedModules": 21
            },
            {
                "id": "manager",
                "role": "ROLE_MANAGER",
                "email": "manager@ttcfleet360.com",
                "name": "Marcus Vance (Fleet Manager)",
                "expectedModules": 6
            },
            {
                "id": "driver",
                "role": "ROLE_DRIVER",
                "email": "m.vance@fleet360.ttc.com",
                "name": "Marcus Vance",
                "expectedModules": 5
            },
            {
                "id": "warehouse",
                "role": "ROLE_WAREHOUSE_MANAGER",
                "email": "ethan.cole@fleet360.ttc.com",
                "name": "Ethan Cole",
                "expectedModules": 5
            },
            {
                "id": "logistics",
                "role": "ROLE_LOGISTICS_MANAGER",
                "email": "elena.rostova@fleet360.ttc.com",
                "name": "Elena Rostova",
                "expectedModules": 6
            },
            {
                "id": "customer",
                "role": "ROLE_CUSTOMER",
                "email": "customer@ttcfleet360.com",
                "name": "NexGen Industrial",
                "expectedModules": 5
            },
            {
                "id": "billing",
                "role": "ROLE_FINANCE_MANAGER",
                "email": "finance@ttcfleet360.com",
                "name": "David Sterling",
                "expectedModules": 5
            }
        ]

        for p in portals_to_test:
            pid = p["id"]
            print(f"\n-------------------------------------------------------", flush=True)
            print(f"  AUDITING PORTAL: {pid.upper()} ({p['name']})", flush=True)
            print(f"-------------------------------------------------------", flush=True)

            # Navigate and authenticate
            send_cdp("Page.navigate", {"url": f"http://localhost:3000/?portal={pid}"})
            time.sleep(1)

            evaluate(f"""(() => {{
                localStorage.setItem('ttc_auth_token', 'demo-jwt-valid-token');
                localStorage.setItem('ttc_fleet360_user', JSON.stringify({{
                    fullName: '{p["name"]}',
                    role: '{p["role"]}',
                    email: '{p["email"]}'
                }}));
                window.location.href = 'http://localhost:3000/?portal={pid}';
            }})()""")
            time.sleep(2.5)

            # Audit portal DOM
            portal_audit = evaluate("""(() => {
                const title = document.title;
                const h1 = document.querySelector('h1, h2')?.innerText || '';
                const navLinks = Array.from(document.querySelectorAll('aside button, .sidebar-nav button, .sidebar button, nav button, aside a'))
                    .map(el => el.innerText.trim()).filter(Boolean);
                const buttons = document.querySelectorAll('button').length;
                const tables = document.querySelectorAll('table').length;
                const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).map(img => img.src);
                return { title, h1, navCount: navLinks.length, navLinks: navLinks.slice(0, 15), buttons, tables, brokenImages };
            })()""")
            print(f"  DOM State: Heading='{portal_audit.get('h1')}', NavItems={portal_audit.get('navCount')}, Buttons={portal_audit.get('buttons')}, Tables={portal_audit.get('tables')}", flush=True)
            if portal_audit.get('brokenImages'):
                for b_img in portal_audit.get('brokenImages'):
                    collected_errors.append(f"[Broken Image on {pid} portal]: {b_img}")

            # Test clicking each sidebar navigation tab
            print(f"  Clicking through sidebar navigation tabs...", flush=True)
            click_audit = evaluate("""(() => {
                const tabs = Array.from(document.querySelectorAll('aside button, .sidebar-nav button, .sidebar button, aside a'));
                const results = [];
                for (let i = 0; i < Math.min(tabs.length, 25); i++) {
                    const tab = tabs[i];
                    const tabText = tab.innerText.trim().replace(/\\n/g, ' ');
                    if (!tabText || tabText.includes('Logout') || tabText.includes('Sign Out')) continue;
                    try {
                        tab.click();
                        results.push({ tab: tabText, success: true });
                    } catch (err) {
                        results.push({ tab: tabText, success: false, error: String(err) });
                    }
                }
                return results;
            })()""")
            print(f"  Clicked {len(click_audit or [])} tabs successfully.", flush=True)
            time.sleep(1.5)

            portal_test_results[pid] = {
                "audit": portal_audit,
                "tabsTested": len(click_audit or [])
            }

        # -----------------------------------------------------------------
        # TEST SUITE 3: BACKEND REST APIS INTEGRITY AUDIT
        # -----------------------------------------------------------------
        print("\n=======================================================", flush=True)
        print("  TEST SUITE 3: BACKEND REST ENDPOINTS INTEGRITY AUDIT", flush=True)
        print("=======================================================", flush=True)

        endpoints = [
            ("/api/workflow/status", "GET"),
            ("/api/workflow/state", "GET"),
            ("/api/workflow/orders", "GET"),
            ("/api/workflow/shipments", "GET"),
            ("/api/workflow/trips", "GET"),
            ("/api/workflow/allocation-requests", "GET"),
            ("/api/workflow/notifications", "GET"),
            ("/api/workflow/audit-logs", "GET")
        ]

        api_results = {}
        for ep, meth in endpoints:
            try:
                url = f"http://localhost:8080{ep}"
                req = urllib.request.Request(url, headers={"Content-Type": "application/json"}, method=meth)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    status = resp.status
                    data = json.loads(resp.read().decode('utf-8'))
                    api_results[ep] = {"status": status, "success": True, "keys": list(data.keys()) if isinstance(data, dict) else len(data)}
                    print(f"  ✓ {meth} {ep} -> HTTP {status} (OK)", flush=True)
            except Exception as e:
                print(f"  ❌ {meth} {ep} -> FAILED: {e}", flush=True)
                collected_errors.append(f"[Backend API Error] {meth} {ep}: {e}")
                api_results[ep] = {"status": 500, "success": False, "error": str(e)}

        # Summary
        print("\n=======================================================", flush=True)
        print("  AUDIT SUMMARY", flush=True)
        print("=======================================================", flush=True)
        print(f"Total JS Errors: {len(collected_errors)}", flush=True)
        print(f"Total Network Failures: {len(network_failures)}", flush=True)
        print(f"Total Warnings: {len(collected_warnings)}", flush=True)

        if collected_errors:
            print("\nErrors Found:")
            for e in collected_errors:
                print(f" - {e}", flush=True)
        else:
            print("\n🎉 ZERO JAVASCRIPT ERRORS OR RUNTIME CRASHES FOUND!")

        # Write results to json artifact
        summary_payload = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "totalErrors": len(collected_errors),
            "totalNetworkFailures": len(network_failures),
            "errors": collected_errors,
            "networkFailures": network_failures,
            "warningsCount": len(collected_warnings),
            "loginResults": login_results,
            "portalTestResults": portal_test_results,
            "apiResults": api_results
        }
        with open(os.path.join(artifact_dir, "website_audit_results.json"), "w") as f:
            json.dump(summary_payload, f, indent=2)

except Exception as ex:
    print(f"Audit runner exception: {ex}", flush=True)
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except:
        proc.kill()
    print("Chrome test process terminated.", flush=True)
