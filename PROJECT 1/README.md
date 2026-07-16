# 🪐 OSINT GENIUS

> **OSINT GENIUS** is an advanced, terminal-themed Single Page Application (SPA) designed for defense-grade Open Source Intelligence (OSINT) gathering, digital forensics, and network analysis. Built with a sleek cyberpunk aesthetic and dark-mode optimization, it consolidates 16 powerful intelligence modules into a unified browser-based operations terminal.

---

## 🚀 GitHub Repository About Description
> *An advanced Single Page Application (SPA) designed for multi-source intelligence gathering, featuring role-based access controls (RBAC), precise geocoding cross-references, and 16 standalone intelligence modules. Created by Jayant Gupta.*

---

## ⚡ Key Highlights & Core Capabilities

### 1. 🛡️ Role-Based Access Control (RBAC) & Clearance Gateway
* **Dual Clearance Modes:** Secure authentication gateway supporting Admin (`genius`) and Guest (`guest`) sessions.
* **Intrusion Shaking:** Failed login inputs trigger screen-shake alerts and flash-red warnings (`ACCESS DENIED — UNAUTHORIZED INTRUSION`).
* **Decryption Animation:** Successful clearance requests trigger terminal decryption simulations mapping modules onto a secure session.
* **Access Control List (ACL):** Admin has a dynamic dashboard settings panel to toggle modules permission checkers for guest accounts in real-time.

### 2. 🗺️ GPS Geocoding Verification ( Lucknow vs. Ballia Resolution )
* **ISP Gateway Offset:** Bypasses ISP gateway routing errors (e.g. when IP geolocators point to regional hubs like Lucknow) by querying browser-hardware GPS (`navigator.geolocation`) in parallel.
* **Haversine Distance Math:** Computes the exact offset distance (in kilometers) between your public IP routing hub and physical location.
* **Dual Marker Polyline:** Renders both coordinates on a Leaflet map connected by a red dotted routing path.

### 3. 📂 100% Offline Local File & Cryptography Sandbox
* **EXIF Metadata Decoder:** Decodes JPEG headers locally to extract camera models, lenses, and precise GPS coordinates without server uploads.
* **Hex Dumper:** Provides a live scrollable 256-byte binary viewer showing hex offsets, byte arrays, and ASCII representations.
* **Hash Subsystem:** Offline calculators for MD5, SHA-1, SHA-256, SHA-512, ROT13, Base64, and Password entropy check.

---

## 🛠️ Consolidated 16 Modules

1. **Dashboard Home:** Quick launchpad, printable HTML reports generator, active case planner, search history logs, and notes scratchpad.
2. **IP Intel:** Geolocation lookup, Shodan port scanner integration, proxy/hosting indicators, and threat score gauge.
3. **Email OSINT:** Verification check, disposable inbox filters, MX records checker, and header hop path parsing.
4. **Domain Intel:** DNS queries (A, AAAA, MX, NS, TXT), subdomains finder, SSL certificate expiry checks, and technology stack identifier.
5. **Username Scanner:** Footprint check across 20 social platforms including real GitHub API queries.
6. **Phone Tracker:** Country database parsing, line type guesser (Mobile/Toll-Free/Landline), local time tracker, and WhatsApp/Truecaller lookup links.
7. **Geo & Maps:** Interactive Leaflet maps, custom reverse-geocoding, and EXIF coordinate maps.
8. **Crypto & Hashes:** Text encoders, hash identifiers, strength tester, and HaveIBeenPwned breach checks.
9. **File Analyzer:** Binary file reader, scrollable hex viewer, string extractors, and hash calculations.
10. **Dark Web Monitor:** Search leaks engine, past breach historical timelines, and Tor exit node checks.
11. **Google Dorking:** Vulnerability templates compiler (log files, directory index, config file, SQL errors) and search engine launcher.
12. **CVE Feed:** Live NVD vulnerability tracker with CVSS metrics and severity levels.
13. **Person Profiler:** Initials avatar generator, matching names to GitHub profiles, and global social queries.
14. **Threat Intel:** IOC validator (IP, MD5, SHA-256), live security feeds, and APT hacker profiles database.
15. **URL Analyzer:** Typosquatting protection, homoglyph indicators, redirect checker, and QR code decoder.
16. **Network Tools:** MAC vendor database lookup, ASN routing blocks mapper, CIDR subnet calculators, and port definitions database.

---

## 🚀 How to Run Locally

Since the terminal runs entirely as a Single Page Application in the client's browser, there is no backend compilation or database setup required.

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/osint-genius.git
   ```
2. Double-click [index.html](index.html) (or right-click and open with Google Chrome, Microsoft Edge, or Mozilla Firefox).
3. Experience the custom boot sequence and sign in:
   * **Admin ID:** `genius` | Password: `12345`
   * **Guest ID:** `guest` | Password: `12345`

---

## 📜 Development & Branding
* **Designed & Built By:** Jayant Gupta
* **Style Engine:** Custom cyberpunk HSL/CSS palettes, custom scrollbars, and neon glow animations.
* **Mapping Engine:** Leaflet JS + OpenStreetMap tiles.
* **Icons:** Font Awesome Free v5.15.4.
* **Fonts:** Space Grotesk (typography) & JetBrains Mono (terminal readouts).
