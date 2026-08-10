#!/usr/bin/env python3
"""
IBM Bob Badge Script
Bundled skill script — handles HTTP calls to the IBM badge issuer service
and local certificate generation using curl (no external Python packages needed).
Everything else (catalogue reading, evaluation) is handled natively by Bob.

Commands:
    get-catalogue         Fetch the active badge catalogue from the issuer service
    submit-for-issuance   POST an approved evaluation to the IBM badge issuer service
    check-status          Check the status of a submitted badge request
    generate-certificate  Generate HTML certificate file locally

Usage:
    python3 .bob/skills/badge-issuer-lite/bob_badge.py get-catalogue \\
        --event-slug "watsonx_challenge_2026" \\
        --json

    python3 .bob/skills/badge-issuer-lite/bob_badge.py submit-for-issuance \\
        --badge-id "ibm-bob-bobathon" \\
        --badge-name "IBM Bob Bobathon" \\
        --event-slug "watsonx_challenge_2026" \\
        --name "Jane Smith" \\
        --email "jane@example.com" \\
        --criteria-met "completed_bobathon_session,built_or_improved_solution" \\
        --summary "Completed full bobathon, built a Flask app with Bob" \\
        --json

    python3 .bob/skills/badge-issuer-lite/bob_badge.py check-status \\
        --request-id "req_abc123" \\
        --json

    python3 .bob/skills/badge-issuer-lite/bob_badge.py generate-certificate \\
        --name "Jane Smith" \\
        --email "jane@example.com" \\
        --badge-name "IBM Bob Bobathon" \\
        --issued-at "2026-07-10" \\
        --verification-code "BOB-EVT-..." \\
        --credly-url "https://credly.com/badges/..."
"""
import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

# ── Env loading ────────────────────────────────────────────────────────────────

def _load_env() -> None:
    root = Path(__file__).parent
    for env_file in [
        root / ".env.badge-issuer",
        root.parent.parent.parent / "badge-issuer" / ".env.badge-issuer",
        root.parent.parent.parent / ".env",
    ]:
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, _, val = line.partition("=")
                        os.environ.setdefault(key.strip(), val.strip())
            break

_load_env()

ISSUER_SERVICE_URL     = os.environ.get("ISSUER_SERVICE_URL", "").rstrip("/")
ISSUER_SERVICE_API_KEY = os.environ.get("ISSUER_SERVICE_API_KEY", "")

IBM_BLUE_HEX = "#1D4ED8"

# ── Output dir — workspace root / badge-issuer-output ─────────────────────────

OUTPUT_DIR = Path.cwd() / "badge-issuer-output"

# ── curl helper ────────────────────────────────────────────────────────────────

def _curl_bin() -> str:
    """Return the path to curl, or raise if not found."""
    curl = shutil.which("curl")
    if curl:
        return curl
    # Windows: curl.exe ships in System32 since Windows 10 1803
    if platform.system() == "Windows":
        win_curl = Path(os.environ.get("SystemRoot", r"C:\Windows"), "System32", "curl.exe")
        if win_curl.exists():
            return str(win_curl)
    raise RuntimeError(
        "curl not found on PATH. Please install curl:\n"
        "  macOS/Linux: usually pre-installed; try 'brew install curl' or your distro package manager\n"
        "  Windows:     ships with Windows 10 1803+; or download from https://curl.se/windows/"
    )


def _curl_get(path: str) -> dict:
    """HTTP GET via curl. Returns parsed JSON or raises on error."""
    if not ISSUER_SERVICE_URL:
        return {"success": False, "error": "ISSUER_SERVICE_URL not set in .env.badge-issuer"}

    url = f"{ISSUER_SERVICE_URL}{path}"
    cmd = [
        _curl_bin(),
        "--silent", "--show-error",
        "--location",
        "--max-time", "30",
        "--header", "Accept: application/json",
        url,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return {"success": False, "error": result.stderr.strip() or f"curl exited {result.returncode}"}
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"success": False, "error": f"Non-JSON response: {result.stdout[:200]}"}


def _curl_post(path: str, payload: dict) -> dict:
    """HTTP POST via curl with JSON body. Returns parsed JSON or raises on error."""
    if not ISSUER_SERVICE_URL:
        return {"success": False, "error": "ISSUER_SERVICE_URL not set in .env.badge-issuer"}
    if not ISSUER_SERVICE_API_KEY:
        return {"success": False, "error": "ISSUER_SERVICE_API_KEY not set in .env.badge-issuer"}

    url = f"{ISSUER_SERVICE_URL}{path}"
    body = json.dumps(payload)

    # Write body to a temp file to avoid shell-quoting issues on all platforms
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as tf:
        tf.write(body)
        tmp_path = tf.name

    try:
        cmd = [
            _curl_bin(),
            "--silent", "--show-error",
            "--location",
            "--max-time", "30",
            "--request", "POST",
            "--header", "Content-Type: application/json",
            "--header", "Accept: application/json",
            "--header", f"X-Issuer-API-Key: {ISSUER_SERVICE_API_KEY}",
            "--data", f"@{tmp_path}",
            url,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
    finally:
        os.unlink(tmp_path)

    if result.returncode != 0:
        return {"success": False, "error": result.stderr.strip() or f"curl exited {result.returncode}"}
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"success": False, "error": f"Non-JSON response: {result.stdout[:200]}"}

    # Surface HTTP-level error detail if the service returned an error body
    if isinstance(data, dict) and data.get("detail"):
        return {"success": False, "error": data["detail"]}
    return data


# ── get-catalogue ──────────────────────────────────────────────────────────────

def cmd_get_catalogue(args) -> dict:
    path = "/api/v1/catalogue"
    if getattr(args, "event_slug", None):
        path += f"?event_slug={args.event_slug}"
    return _curl_get(path)


# ── submit-for-issuance ────────────────────────────────────────────────────────

def cmd_submit(args) -> dict:
    payload = {
        "badge_id":           args.badge_id,
        "badge_name":         args.badge_name or args.badge_id,
        "event_slug":         args.event_slug or "",
        "recipient_name":     args.name,
        "recipient_email":    args.email,
        "criteria_met":       [c.strip() for c in (args.criteria_met or "").split(",") if c.strip()],
        "evaluation_score":   100,
        "evaluation_summary": args.summary or "",
    }
    return _curl_post("/api/v1/queue", payload)


# ── check-status ───────────────────────────────────────────────────────────────

def cmd_check_status(args) -> dict:
    return _curl_get(f"/api/v1/status/{args.request_id}")


# ── Certificate helpers ────────────────────────────────────────────────────────

def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")

def _out_path(name: str, badge_name: str, ext: str) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%Y%m%d")
    return OUTPUT_DIR / f"badge_{_slug(badge_name)}_{_slug(name)}_{date_str}.{ext}"


# ── HTML certificate ───────────────────────────────────────────────────────────

def _gen_html(args) -> Path:
    ch  = IBM_BLUE_HEX
    credly = (
        f'<div style="margin-top:10px"><a href="{args.credly_url}" '
        f'style="border:2px solid {ch};color:{ch};text-decoration:none;'
        f'font-size:13px;font-weight:600;padding:8px 20px;border-radius:8px;'
        f'display:inline-block">Claim your badge on Credly →</a></div>'
        if getattr(args, "credly_url", None) else ""
    )
    html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>IBM Bob Certificate — {args.badge_name}</title>
<style>
body{{font-family:-apple-system,sans-serif;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}}
.card{{background:#fff;border-radius:16px;box-shadow:0 4px 32px rgba(0,0,0,.12);max-width:720px;width:100%;overflow:hidden}}
.hdr{{background:{ch};color:#fff;padding:32px 40px 24px;text-align:center}}
.hdr h1{{font-size:28px;font-weight:700}}.hdr p{{font-size:13px;opacity:.8;margin-top:4px}}
.bar{{height:6px;background:{ch}}}.body{{padding:40px;text-align:center}}
.pill{{display:inline-block;background:#dbeafe;color:{ch};font-size:24px;font-weight:700;padding:10px 28px;border-radius:50px;border:2px solid {ch};margin-bottom:24px}}
.sub{{font-size:15px;color:#6b7280;margin-bottom:8px}}.name{{font-size:34px;font-weight:700;color:#111827;margin-bottom:6px}}
hr{{width:60%;margin:16px auto;border:none;border-top:2px solid {ch}}}
.bn{{font-size:20px;font-weight:600;color:{ch};margin-bottom:24px}}
.meta{{background:#f9fafb;border-radius:10px;padding:18px 24px;margin:0 auto 24px;max-width:400px;text-align:left}}
.mr{{display:flex;justify-content:space-between;font-size:13px;padding:4px 0}}.ml{{color:#6b7280}}.mv{{color:#111827;font-weight:500;font-family:monospace}}
.vbtn{{display:inline-block;background:{ch};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 24px;border-radius:8px}}
.ftr{{border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;font-size:11px;color:#9ca3af}}
</style></head><body><div class="card">
<div class="hdr"><h1>IBM Bob</h1><p>Badge &amp; Certificate Program</p></div>
<div class="bar"></div>
<div class="body">
<div class="pill">🏅 {args.badge_name}</div>
<p class="sub">This certifies that</p><p class="name">{args.name}</p><hr/>
<p class="sub">has successfully earned the</p><p class="bn">{args.badge_name}</p>
<div class="meta">
<div class="mr"><span class="ml">Issued</span><span class="mv">{args.issued_at}</span></div>
<div class="mr"><span class="ml">Issued to</span><span class="mv">{args.email}</span></div>
<div class="mr"><span class="ml">Verification Code</span><span class="mv">{getattr(args, 'verification_code', '')}</span></div>
</div>
{credly}
</div>
<div class="ftr">IBM Corporation — Made with IBM Bob</div>
</div></body></html>"""
    path = _out_path(args.name, args.badge_name, "html")
    path.write_text(html, encoding="utf-8")
    return path


# ── generate-certificate ───────────────────────────────────────────────────────

def cmd_certificate(args) -> None:
    path = _gen_html(args)
    print(str(path))


# ── CLI ────────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--version", action="store_true", help="Print version and exit")
    sub = p.add_subparsers(dest="command")

    gc = sub.add_parser("get-catalogue")
    gc.add_argument("--event-slug", default=None)
    gc.add_argument("--json", action="store_true")

    s = sub.add_parser("submit-for-issuance")
    s.add_argument("--badge-id",     required=True)
    s.add_argument("--badge-name",   default=None)
    s.add_argument("--event-slug",   default=None)
    s.add_argument("--name",         required=True)
    s.add_argument("--email",        required=True)
    s.add_argument("--criteria-met", default="")
    s.add_argument("--summary",      default="")
    s.add_argument("--json",         action="store_true")

    cs = sub.add_parser("check-status")
    cs.add_argument("--request-id", required=True)
    cs.add_argument("--json",       action="store_true")

    c = sub.add_parser("generate-certificate")
    c.add_argument("--name",              required=True)
    c.add_argument("--email",             required=True)
    c.add_argument("--badge-name",        required=True)
    c.add_argument("--issued-at",         required=True)
    c.add_argument("--verification-code", default="")
    c.add_argument("--credly-url",        default=None)

    args = p.parse_args()

    if args.version:
        print("bob_badge.py 0.0.5"); sys.exit(0)

    if not args.command:
        p.print_help(); sys.exit(1)

    if args.command == "get-catalogue":
        result = cmd_get_catalogue(args)
        print(json.dumps(result, indent=2))
    elif args.command == "submit-for-issuance":
        result = cmd_submit(args)
        print(json.dumps(result, indent=2))
    elif args.command == "check-status":
        result = cmd_check_status(args)
        print(json.dumps(result, indent=2))
    elif args.command == "generate-certificate":
        cmd_certificate(args)


if __name__ == "__main__":
    main()
