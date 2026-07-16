/* OSINT GENIUS — Geo & Maps Module */
window.GeoModule = {
  id: 'geo', name: 'Geo & Maps', _map: null, _activeTab: 'geo-ip',

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-cyan"><i class="fas fa-map-marked-alt"></i></div>
          <div><div class="module-title">Geo &amp; Maps Intelligence</div><div class="module-subtitle">IP geolocation, coordinate lookup & EXIF extraction</div></div>
        </div>
      </div>
      <div class="tab-bar" id="geo-tab-bar">
        <button class="tab-btn active" data-tab="geo-ip"><i class="fas fa-network-wired"></i> IP to Map</button>
        <button class="tab-btn" data-tab="geo-coord"><i class="fas fa-crosshairs"></i> Coordinates</button>
        <button class="tab-btn" data-tab="geo-exif"><i class="fas fa-camera"></i> Image EXIF</button>
      </div>
      <div>
        <!-- IP to Map -->
        <div class="tab-panel active" data-panel="geo-ip">
          <div class="card mb-12">
            <div class="input-group">
              <div class="input-wrap flex-1"><i class="fas fa-network-wired input-icon"></i><input class="form-input has-icon" id="geo-ip-input" placeholder="IP address (leave blank for your IP)" /></div>
              <button class="btn btn-primary" id="geo-locate-btn"><i class="fas fa-map-pin"></i> Locate</button>
              <button class="btn btn-secondary" id="geo-myloc-btn"><i class="fas fa-crosshairs"></i> My Location</button>
            </div>
          </div>
          <div class="geo-map-full" id="geo-map"></div>
          <div id="geo-info" class="mt-12"></div>
        </div>

        <!-- Coordinates -->
        <div class="tab-panel" data-panel="geo-coord">
          <div class="card mb-12">
            <div class="grid-2" style="gap:12px;">
              <div><label class="form-label">Latitude</label><input class="form-input" id="coord-lat" placeholder="e.g. 48.8566" /></div>
              <div><label class="form-label">Longitude</label><input class="form-input" id="coord-lon" placeholder="e.g. 2.3522" /></div>
            </div>
            <button class="btn btn-primary mt-12" id="coord-lookup-btn"><i class="fas fa-search-location"></i> Reverse Geocode</button>
          </div>
          <div id="coord-results"></div>
        </div>

        <!-- EXIF -->
        <div class="tab-panel" data-panel="geo-exif">
          <div class="alert alert-warning mb-12">
            <i class="fas fa-exclamation-triangle"></i>
            <div><strong>Privacy Warning:</strong> Photos taken with smartphones often embed GPS coordinates, camera model, and timestamp in their metadata.</div>
          </div>
          <div class="drop-zone" id="exif-drop">
            <i class="fas fa-image"></i>
            <p><strong>Drop an image here</strong> or click to select</p>
            <p style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">Supports JPEG, PNG, TIFF</p>
            <input type="file" id="exif-file-input" accept="image/*" style="display:none;" />
          </div>
          <div id="exif-preview" class="hidden mt-12"></div>
          <div id="exif-results" class="mt-12"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    // Init map
    setTimeout(() => {
      this._map = App.createDarkMap('geo-map', 20, 0, 2);
    }, 300);

    // Geo tabs — also reinit map on tab switch
    document.querySelectorAll('#geo-tab-bar .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._activeTab = btn.dataset.tab;
        if (this._activeTab === 'geo-ip' && !this._map) {
          setTimeout(() => { this._map = App.createDarkMap('geo-map', 20, 0, 2); }, 200);
        }
      });
    });

    document.getElementById('geo-locate-btn').addEventListener('click', () => this.locateIP());
    document.getElementById('geo-myloc-btn').addEventListener('click', () => this.myLocation());
    document.getElementById('coord-lookup-btn').addEventListener('click', () => this.coordLookup());

    // EXIF drop
    const drop = document.getElementById('exif-drop');
    const fileInput = document.getElementById('exif-file-input');
    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) this.extractEXIF(f); });
    fileInput.addEventListener('change', e => { const f=e.target.files[0]; if(f) this.extractEXIF(f); });
  },

  async locateIP() {
    const ip = document.getElementById('geo-ip-input').value.trim();
    document.getElementById('geo-info').innerHTML = `<div class="loader"><div class="spinner"></div><span>Locating...</span></div>`;
    try {
      const g = await API.ipGeo(ip);
      if (g.status === 'fail') throw new Error(g.message);
      App.addToHistory('geo', `IP: ${g.query}`);
      if (this._map) {
        this._map.setView([g.lat, g.lon], 10);
        L.circleMarker([g.lat, g.lon], { radius:12, fillColor:'#00d4ff', color:'#fff', weight:2, fillOpacity:0.85 })
          .addTo(this._map)
          .bindPopup(`<strong>${g.query}</strong><br>${g.city}, ${g.country}<br>${g.isp}`).openPopup();
      }
      document.getElementById('geo-info').innerHTML = `<div class="grid-3 stagger">
        <div class="stat-card animate-fadeInUp"><div class="stat-label">Location</div><div class="stat-value" style="font-size:.9rem;">${g.city}</div><div class="stat-sub">${g.country} ${Utils.countryFlag(g.countryCode)}</div></div>
        <div class="stat-card animate-fadeInUp"><div class="stat-label">Coordinates</div><div class="stat-value" style="font-size:.82rem;">${g.lat.toFixed(4)}, ${g.lon.toFixed(4)}</div><div class="stat-sub">Latitude / Longitude</div></div>
        <div class="stat-card animate-fadeInUp"><div class="stat-label">ISP / ASN</div><div class="stat-value" style="font-size:.75rem;">${g.isp}</div><div class="stat-sub">${g.as}</div></div>
        <div class="stat-card animate-fadeInUp"><div class="stat-label">Timezone</div><div class="stat-value" style="font-size:.82rem;">${g.timezone}</div></div>
        <div class="stat-card animate-fadeInUp"><div class="stat-label">Region</div><div class="stat-value" style="font-size:.82rem;">${g.regionName}</div></div>
        <div class="stat-card animate-fadeInUp"><div class="stat-label">ZIP</div><div class="stat-value">${g.zip||'N/A'}</div></div>
      </div>`;
    } catch(e) {
      document.getElementById('geo-info').innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  myLocation() {
    if (!navigator.geolocation) { App.showToast('Geolocation not supported', 'error'); return; }
    document.getElementById('geo-info').innerHTML = `<div class="loader"><div class="spinner"></div><span>Getting your location...</span></div>`;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      if (this._map) {
        this._map.setView([lat, lon], 14);
        L.circleMarker([lat, lon], { radius:12, fillColor:'#00ff88', color:'#fff', weight:2, fillOpacity:0.85 })
          .addTo(this._map).bindPopup('Your Location').openPopup();
      }
      document.getElementById('geo-info').innerHTML = `<div class="alert alert-success"><i class="fas fa-crosshairs"></i> Your location: <strong>${lat.toFixed(6)}, ${lon.toFixed(6)}</strong> <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn btn-secondary btn-sm ms-2"><i class="fas fa-external-link-alt"></i> Google Maps</a></div>`;
    }, () => App.showToast('Location access denied', 'error'));
  },

  async coordLookup() {
    const lat = parseFloat(document.getElementById('coord-lat').value);
    const lon = parseFloat(document.getElementById('coord-lon').value);
    if (isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180) { App.showToast('Enter valid coordinates', 'warning'); return; }
    const res = document.getElementById('coord-results');
    res.innerHTML = `<div class="loader"><div class="spinner"></div><span>Reverse geocoding...</span></div>`;
    try {
      const data = await API.nominatimReverse(lat, lon);
      const addr = data.address || {};
      App.addToHistory('geo', `Coords: ${lat},${lon}`);
      if (this._map) {
        this._map.setView([lat, lon], 13);
        L.circleMarker([lat, lon], { radius:12, fillColor:'#7b2fff', color:'#fff', weight:2, fillOpacity:0.85 })
          .addTo(this._map).bindPopup(`${lat}, ${lon}`).openPopup();
      }
      res.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-map-marker-alt"></i> Reverse Geocode Result</div></div>
        <div class="data-row"><span class="data-label">Full Address</span><span class="data-value">${Utils.escapeHtml(data.display_name||'N/A')}</span></div>
        <div class="data-row"><span class="data-label">Country</span><span class="data-value">${Utils.countryFlag(addr.country_code?.toUpperCase())} ${addr.country||'N/A'}</span></div>
        <div class="data-row"><span class="data-label">City</span><span class="data-value">${addr.city||addr.town||addr.village||'N/A'}</span></div>
        <div class="data-row"><span class="data-label">State</span><span class="data-value">${addr.state||'N/A'}</span></div>
        <div class="data-row"><span class="data-label">Postcode</span><span class="data-value">${addr.postcode||'N/A'}</span></div>
        <div class="flex gap-8 mt-12">
          <a class="btn btn-secondary btn-sm" href="https://maps.google.com/?q=${lat},${lon}" target="_blank"><i class="fab fa-google"></i> Google Maps</a>
          <a class="btn btn-secondary btn-sm" href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}" target="_blank"><i class="fas fa-map"></i> OpenStreetMap</a>
        </div>
      </div>`;
    } catch(e) {
      res.innerHTML = `<div class="alert alert-danger">${Utils.escapeHtml(e.message)}</div>`;
    }
  },

  extractEXIF(file) {
    const preview = document.getElementById('exif-preview');
    const results = document.getElementById('exif-results');
    preview.classList.remove('hidden');
    preview.innerHTML = `<img src="${URL.createObjectURL(file)}" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid var(--border-cyan);" />`;
    results.innerHTML = `<div class="loader"><div class="spinner"></div><span>Extracting EXIF metadata...</span></div>`;

    const reader = new FileReader();
    reader.onload = e => {
      const buf = e.target.result;
      const view = new DataView(buf);
      const tags = this.parseEXIF(view, buf);

      if (!tags || !Object.keys(tags).length) {
        results.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle"></i> No EXIF metadata found in this image. It may have been stripped.</div>`;
        return;
      }

      const gps = tags.GPS;
      let gpsHtml = '';
      if (gps && gps.lat != null && gps.lon != null) {
        gpsHtml = `<div class="alert alert-warning mt-12"><i class="fas fa-exclamation-triangle"></i> <strong>GPS Found!</strong> This image contains location data: ${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)} <a href="https://maps.google.com/?q=${gps.lat},${gps.lon}" target="_blank" class="btn btn-secondary btn-sm ms-2">View on Map</a></div>`;
      }

      results.innerHTML = `<div class="card animate-fadeInUp">
        <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> EXIF Metadata</div></div>
        <table class="exif-table">
          ${Object.entries(tags).filter(([k])=>k!=='GPS').map(([k,v])=>`<tr><td>${k}</td><td>${Utils.escapeHtml(String(v))}</td></tr>`).join('')}
          ${gps ? `<tr><td>GPS Latitude</td><td class="text-cyan">${gps.lat?.toFixed(6)||'N/A'}</td></tr><tr><td>GPS Longitude</td><td class="text-cyan">${gps.lon?.toFixed(6)||'N/A'}</td></tr>` : ''}
        </table>
        ${gpsHtml}
      </div>`;
    };
    reader.readAsArrayBuffer(file);
  },

  parseEXIF(view, buf) {
    const tags = {};
    // JPEG check
    if (view.getUint16(0) !== 0xFFD8) return tags;
    let offset = 2;
    while (offset < view.byteLength - 2) {
      const marker = view.getUint16(offset);
      offset += 2;
      if (marker === 0xFFE1) { // APP1 = EXIF
        const len = view.getUint16(offset);
        const exifStart = offset + 2;
        if (view.getUint32(exifStart) === 0x45786966) { // "Exif"
          const tiffOffset = exifStart + 6;
          const le = view.getUint16(tiffOffset) === 0x4949;
          const ifdOffset = tiffOffset + view.getUint32(tiffOffset + 4, le);
          this.readIFD(view, tiffOffset, ifdOffset, le, tags);
        }
        break;
      }
      offset += view.getUint16(offset);
    }
    return tags;
  },

  readIFD(view, base, offset, le, tags) {
    try {
      const count = view.getUint16(offset, le);
      const tagMap = { 0x010F:'Camera Make', 0x0110:'Camera Model', 0x0112:'Orientation', 0x0132:'Date/Time', 0xA002:'Width', 0xA003:'Height', 0x013B:'Artist', 0x013E:'WhitePoint', 0x8769:'ExifIFD', 0x8825:'GPSIFD', 0x9003:'DateTimeOriginal', 0x9004:'DateTimeDigitized', 0xA420:'ImageUniqueID' };
      const gpsMap = { 0x0001:'GPSLatRef', 0x0002:'GPSLat', 0x0003:'GPSLonRef', 0x0004:'GPSLon' };
      for (let i=0; i<count; i++) {
        const tag = view.getUint16(offset+2+i*12, le);
        const type = view.getUint16(offset+2+i*12+2, le);
        const len = view.getUint32(offset+2+i*12+4, le);
        const valOff = offset+2+i*12+8;
        if (tag === 0x8825) {
          const gpsOff = base + view.getUint32(valOff, le);
          const gps = {}; this.readIFD(view, base, gpsOff, le, gps);
          const lat = this.dmsToDecimal(gps.GPSLat, gps.GPSLatRef);
          const lon = this.dmsToDecimal(gps.GPSLon, gps.GPSLonRef);
          tags.GPS = { lat, lon };
        } else if (tagMap[tag]) {
          try {
            const dataOffset = len>4 ? (base+view.getUint32(valOff,le)) : valOff;
            let val = '';
            if (type === 2) { for(let j=0;j<len-1;j++) val+=String.fromCharCode(view.getUint8(dataOffset+j)); }
            else if (type === 3) val = view.getUint16(dataOffset, le);
            else if (type === 4) val = view.getUint32(dataOffset, le);
            else if (type === 5) { const n=view.getUint32(dataOffset,le); const d=view.getUint32(dataOffset+4,le); val=d?`${(n/d).toFixed(4)}`:`${n}/${d}`; }
            if (val) tags[tagMap[tag]] = val;
          } catch {}
        } else if (gpsMap[tag]) {
          try {
            const dataOffset = len>4 ? (base+view.getUint32(valOff,le)) : valOff;
            if (type === 2) { let v=''; for(let j=0;j<len-1;j++) v+=String.fromCharCode(view.getUint8(dataOffset+j)); tags[gpsMap[tag]]=v.trim(); }
            else if (type === 5) { const arr=[]; for(let j=0;j<3;j++) { const n=view.getUint32(dataOffset+j*8,le); const d=view.getUint32(dataOffset+j*8+4,le); arr.push(d?n/d:n); } tags[gpsMap[tag]]=arr; }
          } catch {}
        }
      }
    } catch {}
  },

  dmsToDecimal(dms, ref) {
    if (!Array.isArray(dms) || dms.length < 3) return null;
    const decimal = dms[0] + dms[1]/60 + dms[2]/3600;
    return (ref === 'S' || ref === 'W') ? -decimal : decimal;
  }
};
