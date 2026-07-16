/* OSINT GENIUS — IP Intelligence Module */
window.IPModule = {
  id: 'ip', name: 'IP Intelligence', _map: null,

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-cyan"><i class="fas fa-network-wired"></i></div>
          <div><div class="module-title">IP Intelligence</div><div class="module-subtitle">Geolocation, ASN, ports, CVEs & threat scoring</div></div>
        </div>
      </div>
      <div class="card mb-16">
        <div class="input-group">
          <div class="input-wrap flex-1">
            <i class="fas fa-network-wired input-icon"></i>
            <input class="form-input has-icon" id="ip-input" placeholder="Enter IP address (e.g. 8.8.8.8)" />
          </div>
          <button class="btn btn-primary" id="ip-lookup-btn"><i class="fas fa-search"></i> Lookup</button>
          <button class="btn btn-secondary" id="ip-myip-btn"><i class="fas fa-crosshairs"></i> My IP</button>
        </div>
      </div>
      <div id="ip-results" class="hidden"></div>
    </div>`;
  },

  init() {
    document.getElementById('ip-lookup-btn').addEventListener('click', () => {
      const ip = document.getElementById('ip-input').value.trim();
      if (!ip) { App.showToast('Enter an IP address', 'warning'); return; }
      if (!Utils.isValidIP(ip)) { App.showToast('Invalid IP address format', 'error'); return; }
      this.lookup(ip);
    });
    document.getElementById('ip-myip-btn').addEventListener('click', () => this.lookup(''));
    document.getElementById('ip-input').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('ip-lookup-btn').click(); });
  },

  getGPS() {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  },

  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  },

  async lookup(ip) {
    const res = document.getElementById('ip-results');
    res.classList.remove('hidden');
    res.innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Querying intelligence sources...</span></div>`;
    try {
      const gpsPromise = (!ip) ? this.getGPS() : Promise.resolve(null);
      const [geo, idb, gps] = await Promise.allSettled([
        API.ipGeo(ip),
        ip ? API.shodanInternetDB(ip) : Promise.resolve(null),
        gpsPromise
      ]);

      const g = geo.status === 'fulfilled' ? geo.value : null;
      const s = idb.status === 'fulfilled' ? idb.value : null;
      if (!g || g.status === 'fail') throw new Error(g?.message || 'Geolocation failed');

      let gpsData = null;
      if (gps.status === 'fulfilled' && gps.value) {
        try {
          gpsData = await API.nominatimReverse(gps.value.lat, gps.value.lon);
          gpsData.lat = gps.value.lat;
          gpsData.lon = gps.value.lon;
        } catch(e) {
          gpsData = { lat: gps.value.lat, lon: gps.value.lon, display_name: 'GPS Precise Coordinates' };
        }
      }

      this.renderResult(g, s, gpsData);
      App.addToHistory('ip', g.query || ip);
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> Error: ${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  renderResult(g, s, gpsData) {
    const flag = Utils.countryFlag(g.countryCode);
    const ports = s?.ports || [];
    const cves = s?.cves || [];
    const tags = s?.tags || [];
    const threatScore = Math.min(100, ports.length * 5 + cves.length * 15 + (g.proxy ? 20 : 0) + (g.hosting ? 10 : 0));
    const scoreColor = threatScore >= 70 ? 'var(--red)' : threatScore >= 40 ? 'var(--amber)' : 'var(--green)';

    const portChips = ports.map(p => {
      const cls = [22,23,3389,5900,4444].includes(p) ? 'danger' : [80,8080,8443,8000].includes(p) ? 'warn' : '';
      return `<span class="port-chip ${cls}" title="Port ${p}">${p}</span>`;
    }).join('') || `<span class="text-muted" style="font-size:.8rem;">No open ports found</span>`;

    const cveChips = cves.map(c => `<a class="cve-chip" href="https://nvd.nist.gov/vuln/detail/${c}" target="_blank">${c}</a>`).join('')
      || `<span class="text-muted" style="font-size:.8rem;">No CVEs found</span>`;

    const tagBadges = tags.map(t => `<span class="badge badge-amber">${t}</span>`).join('');

    let discrepancyHtml = '';
    let offsetKm = 0;
    if (gpsData) {
      offsetKm = this.haversine(g.lat, g.lon, gpsData.lat, gpsData.lon);
      const isOffset = offsetKm > 15;
      const gpsCity = gpsData.address?.city || gpsData.address?.town || gpsData.address?.village || gpsData.address?.county || 'Precise Location';
      discrepancyHtml = `
        <div class="card mb-12" style="border-left:3px solid var(--${isOffset?'amber':'green'});">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-crosshairs text-${isOffset?'amber':'green'}"></i> GPS Cross-Reference Verification</div>
            <span class="badge badge-${isOffset?'amber':'green'}">${isOffset?'DISCREPANCY DETECTED':'LOCATIONS MATCH'}</span>
          </div>
          <div class="grid-2">
            <div>
              <div class="data-row"><span class="data-label">IP Geolocated City</span><span class="data-value text-cyan">${g.city}</span></div>
              <div class="data-row"><span class="data-label">Hardware GPS City</span><span class="data-value text-green">${gpsCity}</span></div>
            </div>
            <div>
              <div class="data-row"><span class="data-label">GPS Coordinates</span><span class="data-value mono">${gpsData.lat.toFixed(5)}, ${gpsData.lon.toFixed(5)}</span></div>
              <div class="data-row"><span class="data-label">Discrepancy Offset</span><span class="data-value text-red font-bold">${offsetKm} km</span></div>
            </div>
          </div>
          ${isOffset ? `
            <div class="alert alert-warning mt-12 mb-0">
              <i class="fas fa-info-circle"></i>
              <div><strong>ISP Routing Hub Effect:</strong> Geolocation discrepancy is common. Your ISP (Internet Service Provider) routes data through their regional servers (e.g. <strong>${g.city}</strong>), while your device is physically located in <strong>${gpsCity}</strong>.</div>
            </div>` : ''}
        </div>
      `;
    }

    document.getElementById('ip-results').innerHTML = `
      <div class="tab-bar mb-16">
        <button class="tab-btn active" data-tab="ip-overview"><i class="fas fa-globe"></i> Overview</button>
        <button class="tab-btn" data-tab="ip-ports"><i class="fas fa-door-open"></i> Ports & CVEs</button>
        <button class="tab-btn" data-tab="ip-raw"><i class="fas fa-code"></i> Raw Data</button>
      </div>
      <div>
        <div class="tab-panel active scan-result animate-fadeInUp" data-panel="ip-overview">
          ${discrepancyHtml}
          <div class="grid-2 gap-16">
            <div>
              <div class="ip-map-mini" id="ip-mini-map"></div>
              <div class="card mt-12">
                <div class="flex items-center gap-12 mb-12">
                  <span style="font-size:3rem;">${flag}</span>
                  <div>
                    <div style="font-size:1.1rem;font-weight:700;">${g.country}</div>
                    <div class="text-secondary" style="font-size:.82rem;">${g.regionName}, ${g.city}</div>
                    <div class="flex gap-4 mt-4">${tagBadges}${g.proxy?'<span class="badge badge-red">PROXY</span>':''}${g.hosting?'<span class="badge badge-amber">HOSTING</span>':''}</div>
                  </div>
                </div>
                <div class="data-row"><span class="data-label">IP Address</span><span class="data-value text-cyan">${g.query}<button class="copy-btn ms-1" onclick="copyToClipboard('${g.query}')">copy</button></span></div>
                <div class="data-row"><span class="data-label">ISP</span><span class="data-value">${g.isp}</span></div>
                <div class="data-row"><span class="data-label">Organisation</span><span class="data-value">${g.org}</span></div>
                <div class="data-row"><span class="data-label">ASN</span><span class="data-value text-purple">${g.as}</span></div>
                <div class="data-row"><span class="data-label">Timezone</span><span class="data-value">${g.timezone}</span></div>
                <div class="data-row"><span class="data-label">Coordinates</span><span class="data-value">${g.lat}, ${g.lon}</span></div>
                <div class="data-row"><span class="data-label">ZIP Code</span><span class="data-value">${g.zip||'N/A'}</span></div>
              </div>
            </div>
            <div>
              <div class="card mb-12">
                <div class="card-header"><div class="card-title"><i class="fas fa-radiation"></i> Threat Score</div></div>
                <div class="risk-meter">
                  <div class="risk-bar-track flex-1"><div class="risk-bar-fill" style="width:${threatScore}%;background:${scoreColor};box-shadow:0 0 8px ${scoreColor};"></div></div>
                  <span class="risk-score" style="color:${scoreColor};">${threatScore}</span>
                </div>
                <div style="margin-top:8px;font-size:.75rem;color:var(--text-muted);">Based on open ports, CVEs, and proxy indicators</div>
              </div>
              <div class="card mb-12">
                <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> Network Info</div></div>
                <div class="data-row"><span class="data-label">Mobile</span><span class="data-value">${g.mobile?'<span class="badge badge-amber">Yes</span>':'<span class="badge badge-muted">No</span>'}</span></div>
                <div class="data-row"><span class="data-label">Proxy/VPN</span><span class="data-value">${g.proxy?'<span class="badge badge-red">Detected</span>':'<span class="badge badge-green">Clean</span>'}</span></div>
                <div class="data-row"><span class="data-label">Hosting</span><span class="data-value">${g.hosting?'<span class="badge badge-amber">Yes</span>':'<span class="badge badge-muted">No</span>'}</span></div>
                <div class="data-row"><span class="data-label">Open Ports</span><span class="data-value text-cyan">${ports.length}</span></div>
                <div class="data-row"><span class="data-label">CVEs</span><span class="data-value text-red">${cves.length}</span></div>
              </div>
              <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-external-link-alt"></i> Quick Links</div></div>
                <div class="flex-col gap-4">
                  <a class="btn btn-secondary btn-sm" href="https://shodan.io/host/${g.query}" target="_blank"><i class="fas fa-eye"></i> View on Shodan</a>
                  <a class="btn btn-secondary btn-sm" href="https://www.virustotal.com/gui/ip-address/${g.query}" target="_blank"><i class="fas fa-shield-virus"></i> VirusTotal</a>
                  <a class="btn btn-secondary btn-sm" href="https://www.abuseipdb.com/check/${g.query}" target="_blank"><i class="fas fa-ban"></i> AbuseIPDB</a>
                  <a class="btn btn-secondary btn-sm" href="https://ipinfo.io/${g.query}" target="_blank"><i class="fas fa-info-circle"></i> ipinfo.io</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-panel animate-fadeInUp" data-panel="ip-ports">
          <div class="card mb-16">
            <div class="card-header"><div class="card-title"><i class="fas fa-door-open"></i> Open Ports (${ports.length})</div></div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;min-height:40px;">${portChips}</div>
          </div>
          <div class="card mb-16">
            <div class="card-header"><div class="card-title"><i class="fas fa-bug"></i> CVEs (${cves.length})</div></div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;min-height:40px;">${cveChips}</div>
          </div>
          ${s?.hostnames?.length ? `<div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-server"></i> Hostnames</div></div><div>${s.hostnames.map(h=>`<span class="badge badge-cyan m-1">${h}</span>`).join('')}</div></div>` : ''}
        </div>
        <div class="tab-panel" data-panel="ip-raw">
          <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-code"></i> Raw API Response</div><button class="copy-btn" onclick="copyToClipboard(document.getElementById('ip-raw-json').textContent)">Copy JSON</button></div>
            <div class="terminal-output" id="ip-raw-json">${Utils.escapeHtml(JSON.stringify({geolocation:g, shodanInternetDB:s, gpsCrossReference:gpsData}, null, 2))}</div>
          </div>
        </div>
      </div>`;

    App.bindTabs(document.getElementById('ip-results'));

    setTimeout(() => {
      try {
        if (this._map) { this._map.remove(); this._map = null; }
        const centerLat = gpsData ? (g.lat + gpsData.lat)/2 : g.lat;
        const centerLon = gpsData ? (g.lon + gpsData.lon)/2 : g.lon;
        const zoom = gpsData ? 6 : 10;
        this._map = App.createDarkMap('ip-mini-map', centerLat, centerLon, zoom);

        // IP Location Marker
        L.circleMarker([g.lat, g.lon], { radius:10, fillColor:'#00d4ff', color:'#fff', fillOpacity:0.8, weight:2 })
          .addTo(this._map)
          .bindPopup(`<strong>IP Gateway Geolocation</strong><br>${g.city}, ${g.country}<br>${g.isp}`);

        if (gpsData) {
          // GPS Location Marker
          L.circleMarker([gpsData.lat, gpsData.lon], { radius:10, fillColor:'#00ff88', color:'#fff', fillOpacity:0.8, weight:2 })
            .addTo(this._map)
            .bindPopup(`<strong>Precision GPS Coordinates</strong><br>${gpsData.display_name}`).openPopup();

          // Dotted connection line showing offset
          L.polyline([[g.lat, g.lon], [gpsData.lat, gpsData.lon]], {
            color: 'var(--red)',
            dashArray: '5, 8',
            weight: 2
          }).addTo(this._map).bindTooltip(`Offset Distance: ${offsetKm} km`);
        } else {
          // Open normal IP popup if no GPS discrepancy exists
          L.circleMarker([g.lat, g.lon], { radius:10, fillColor:'#00d4ff', color:'#fff', fillOpacity:0.8, weight:2 })
            .addTo(this._map).openPopup();
        }
      } catch(e) { console.warn('Map error:', e); }
    }, 200);
  }
};
