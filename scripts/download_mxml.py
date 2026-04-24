#!/usr/bin/env python3
"""Download all MusicXML files from effendi.me/jazz/repo/"""
import urllib.request
import urllib.parse
import urllib.error
import os
import time
import html
import re

BASE_URL = "https://effendi.me/jazz/repo/"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "data", "songs", "mxml")

DIRS = ["I", "II", "III", "IV_Part-1", "IV_Part-2"]

def fetch_listing(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")

def parse_files(html_content):
    """Extract file hrefs from Apache directory listing."""
    pattern = r'href="([^"?/][^"]*\.(?:xml|musicxml))"'
    files = re.findall(pattern, html_content, re.IGNORECASE)
    return [html.unescape(f) for f in files]

def download_file(url, dest_path):
    if os.path.exists(dest_path):
        return "skip"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(dest_path, "wb") as f:
            f.write(data)
        return "ok"
    except urllib.error.HTTPError as e:
        return f"http-{e.code}"
    except Exception as e:
        return f"err-{e}"

total_ok = 0
total_skip = 0
total_err = 0

for d in DIRS:
    dir_url = BASE_URL + d + "/"
    out_subdir = os.path.join(OUT_DIR, d)
    os.makedirs(out_subdir, exist_ok=True)

    print(f"\n=== Directory: {d} ===")
    try:
        listing = fetch_listing(dir_url)
    except Exception as e:
        print(f"  ERROR fetching listing: {e}")
        continue

    files = parse_files(listing)
    print(f"  Found {len(files)} files")

    for fname in files:
        encoded = urllib.parse.quote(fname, safe="")
        url = dir_url + encoded
        dest = os.path.join(out_subdir, fname)
        result = download_file(url, dest)
        if result == "ok":
            total_ok += 1
            print(f"  OK  {fname}")
        elif result == "skip":
            total_skip += 1
        else:
            total_err += 1
            print(f"  ERR {fname}: {result}")
        time.sleep(0.05)  # be polite

print(f"\n=== DONE: {total_ok} downloaded, {total_skip} skipped, {total_err} errors ===")
